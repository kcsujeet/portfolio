---
title: What a Broken Migration Taught Me About Database Locking
description: How PostgreSQL locking works, why ALTER TABLE needs a table-level lock instead of a row-level one, and what happened when disable_ddl_transaction! turned one failed migration into a schema state Rails couldn't recover from.
pubDate: 2026-08-13T21:28:29-07:00
tags: ["postgresql", "rails", "ruby", "database"]
---

## The problem

A while back I added a column and an index to one of our tables. Small change, part of a bigger feature, and it ran clean locally and on staging.

In production the deploy stopped partway through. The migration didn't finish, and when I ran it again it failed immediately, before it could do anything at all. Deploys stayed blocked until I worked out why.

Here is the migration, with the table and column renamed:

```ruby
class AddTagIdsToWidgets < ActiveRecord::Migration[7.2]
  disable_ddl_transaction!

  def change
    add_column :widgets, :tag_ids, :integer, array: true, default: []
    add_index :widgets, :tag_ids, using: :gin, algorithm: :concurrently
  end
end
```

I'd written migrations like this before. I knew `disable_ddl_transaction!` was needed to build the index concurrently, and that was about as far as my understanding went.

To work out what had happened, I first had to understand what a migration actually does to a table while it runs, and that comes down to locking. So let's start there: what a lock is, and what it does.

## Why databases need locks at all

A production database has many things trying to read and write at the same time. Multiple requests, background jobs, and in our case a migration can all be touching the same table in the same moment. Without coordination that's a recipe for corruption. Two transactions could both read the same row, both decide to update it based on what they read, and one of those updates would silently overwrite the other. Or a transaction could read a row being modified by another transaction that hasn't finished yet, and end up working with data that's about to be rolled back.

Locks are how Postgres prevents that. A lock is really just a rule that says: while I'm doing this, nothing else gets to do something that would conflict with it. If two operations don't conflict, like two `UPDATE`s on different rows, Postgres lets them both proceed at once. If they do conflict, one waits. It's the same basic idea as a mutex in application code, applied at the scale of a database serving many concurrent connections.

For migrations, what matters is that Postgres doesn't apply this at a single granularity. What counts as "conflicting" depends on what you're doing, and that determines whether you get a narrow, cheap lock or a broad, expensive one.

## Row locks, table locks, and where ALTER TABLE lands

Most day-to-day locking in Postgres happens at the row level, which is why normal application traffic barely notices locks exist. When you run an `UPDATE` or `DELETE`, Postgres locks just the rows that statement touches. A hundred requests can update a hundred different rows in the same table simultaneously without stepping on each other.

Schema changes work differently. Most schema changes you'd write in a Rails migration map to an `ALTER TABLE` under the hood, and the Postgres docs are blunt about what that costs: "Note that the lock level required may differ for each subform. An `ACCESS EXCLUSIVE` lock is acquired unless explicitly noted." ([ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html))

The "unless explicitly noted" matters. A handful of subforms are documented as taking something weaker, but the default is the heaviest lock available, and `ADD COLUMN` takes the default.

`ACCESS EXCLUSIVE` is the strongest lock Postgres has. Per the [explicit locking docs](https://www.postgresql.org/docs/current/explicit-locking.html), it "conflicts with locks of all modes" and guarantees "the holder is the only transaction accessing the table in any way." The same page notes that "Only an `ACCESS EXCLUSIVE` lock blocks a `SELECT` (without `FOR UPDATE/SHARE`) statement." Every other lock mode lets plain reads through.

## Why a table lock, and not just a row lock

The reason `ALTER TABLE` can't get away with a row-level lock comes down to what's being changed. An `UPDATE` changes the *values* inside existing rows; the shape of the row stays the same. `ALTER TABLE` changes the *shape*, the column definitions every row in the table shares. That shape isn't stored per row, it's stored once in the system catalogs (`pg_attribute`, `pg_class`), and every row is interpreted according to that one shared definition.

There's no meaningful way to lock half of that definition. You can't have some rows read under the old column layout and some under the new one while queries are running, which is exactly the inconsistency locks exist to prevent. So Postgres locks the whole table for the duration.

That's also why it needs the strongest lock rather than something weaker. Even a plain `SELECT` needs the table's current column layout to read a row correctly, so even read-only queries have to wait. A schema change and a query holding an outdated picture of that schema can't safely run at the same time.

## Why the lock turns into a queue

Holding a lock briefly isn't automatically a problem. What makes it one is how Postgres hands locks out when more than one thing wants the same table.

If a query is already running when your migration fires, the `ALTER TABLE` waits for it to finish. That part is expected. The part I hadn't appreciated is what happens next: once your migration is sitting there waiting, every new query that arrives after it also waits, including simple reads.

This is in the lock manager itself. From `LockAcquireExtended` in [`src/backend/storage/lmgr/lock.c`](https://github.com/postgres/postgres/blob/master/src/backend/storage/lmgr/lock.c):

```c
/*
 * If lock requested conflicts with locks requested by waiters, must join
 * wait queue.  Otherwise, check for conflict with already-held locks.
 * (That's last because most complex check.)
 */
if (lockMethodTable->conflictTab[lockmode] & lock->waitMask)
    found_conflict = true;
```

A new `SELECT` wants `ACCESS SHARE`. That conflicts with the `ACCESS EXCLUSIVE` your migration is *waiting* for, not just ones already held, so it joins the queue rather than jumping ahead. A migration stuck waiting for its lock builds a queue behind itself, and everything in that queue is blocked by a lock nobody is even holding yet.

## What determines how bad it gets

How much this hurts depends on three things stacking: what the operation requires Postgres to do, how big the table is, and how much traffic it's under.

Start with the operation, since it decides how long the lock is held. The Postgres docs are precise here, and this is the part I had wrong in my head:

> When a column is added with `ADD COLUMN` and a non-volatile `DEFAULT` is specified, the default value is evaluated at the time of the statement and the result stored in the table's metadata [...] making the `ALTER TABLE` very fast even on large tables. If no column constraints are specified, NULL is used as the `DEFAULT`. In neither case is a rewrite of the table required.

What *does* force a rewrite:

> Adding a column with a volatile `DEFAULT` (e.g., `clock_timestamp()`), a stored generated column, an identity column, or a column with a domain data type that has constraints will cause the entire table and its indexes to be rewritten.

Note what isn't on that list: `NOT NULL`. I had absorbed the pre-Postgres-11 folklore that `NOT NULL` plus a default meant a rewrite. It doesn't, and hasn't for years. The trigger is *volatility*, not nullability. Changing an existing column's type is the other common rewrite, with a narrow exception when the old type is binary coercible to the new one.

Table size only matters once you're in rewrite territory. A metadata-only change is near-instant regardless of row count. A rewrite scales with it, and the docs warn it "will temporarily require as much as double the disk space." A table with tens of millions of rows can hold `ACCESS EXCLUSIVE` for minutes.

Traffic decides whether anyone notices. A lock held for two minutes on a table nobody queries is a non-event. A lock held for a fraction of a second on a constantly-hit table can still start a queue, for the reason above.

So the real danger is the combination: a rewriting operation, on a table that's both large and busy. Ours wasn't that. An empty array is a non-volatile default, so `add_column` landed on the fast metadata-only path and never triggered a rewrite. The lock was real but brief, and any pain came from queueing rather than duration. Nobody reported anything at the time and I can't say for certain customers felt it, but it's one of our busier tables, and knowing what I know now about that queue I'd guess it wasn't entirely invisible. It's still the first thing I check on a migration touching a busy table, because the moment someone reaches for a computed default or a type change, that brief lock becomes an extended one.

## The Rails half of the problem

The lock was the first issue. The second was stranger, and it cost me more time.

Look again at the directive sitting above `def change`:

```ruby
disable_ddl_transaction!
```

It's there because of the index, and that's a second locking story running alongside the first.

Building an index isn't free either. A plain `CREATE INDEX` takes a `SHARE` lock, which the [locking docs](https://www.postgresql.org/docs/current/explicit-locking.html) list as "Acquired by `CREATE INDEX` (without `CONCURRENTLY`)." `SHARE` conflicts with `ROW EXCLUSIVE`, the mode every `INSERT`, `UPDATE`, and `DELETE` takes. The [CREATE INDEX docs](https://www.postgresql.org/docs/current/sql-createindex.html) spell out what that feels like: "Other transactions can still read the table, but if they try to insert, update, or delete rows in the table they will block until the index build is finished."

So it sits between the two extremes. `ACCESS EXCLUSIVE` blocks everything including reads. `SHARE` lets reads through and stops writes. On a GIN index over a busy table, that's a long time to accept no writes.

`CONCURRENTLY` is how you avoid it: it takes `SHARE UPDATE EXCLUSIVE` instead, which doesn't conflict with `ROW EXCLUSIVE`, so writes keep flowing throughout the build.

The catch is in the same docs: "a regular `CREATE INDEX` command can be performed within a transaction block, but `CREATE INDEX CONCURRENTLY` cannot." Rails wraps each migration in a transaction on Postgres by default, so using `algorithm: :concurrently` requires you to turn that wrapper off. That's the whole reason `disable_ddl_transaction!` is in the file.

That trade is where the second problem starts. Normally, if a migration fails halfway, the transaction rolls back and you're returned to a clean state. With `disable_ddl_transaction!`, there is no wrapper. The two statements are independent. If the first succeeds and the second fails, the column stays and Rails never writes the row into `schema_migrations` that would mark the migration as done.

And the second statement is the one most likely to fail. Concurrent index builds are slow by design:

> PostgreSQL must perform two scans of the table, and in addition it must wait for all existing transactions that could potentially modify or use the index to terminate. Thus this method requires more total work than a standard index build and takes significantly longer to complete.

On a busy table, waiting for every in-flight transaction to finish can take a long while. Long enough for a deploy step to hit its timeout. We run on Kubernetes, which adds a second way for this to end badly: a migration that runs long can be cut off when the pod executing it is replaced during a rollout.

So the state I ended up in was: column present, index missing or invalid, `schema_migrations` empty. Rails had no idea the migration had partly run. The next attempt started over from the first statement and hit `PG::DuplicateColumn`, which aborts the entire migration run, including everything queued behind it. It never even reached the index.

I never traced the exact failure to a specific pod or retry, so I can't prove that sequence. But the shape fits, and the fix is the tell: the follow-up PR added `if_not_exists: true` to *both* lines, not just the column. You only need it on the index if the index is something that might already be sitting there.

```ruby
class AddTagIdsToWidgets < ActiveRecord::Migration[7.2]
  disable_ddl_transaction!

  def change
    add_column :widgets, :tag_ids, :integer, array: true,
               default: [], if_not_exists: true
    add_index :widgets, :tag_ids, using: :gin,
              algorithm: :concurrently, if_not_exists: true
  end
end
```

These options landed in Rails 6.1, credited to Eileen M. Uchitelle: "Adds support for `if_not_exists` to `add_column` and `if_exists` to `remove_column`." With them, a statement whose work is already done gets out of the way instead of raising.

## The caveat I'd have missed

There's a sharp edge here I only found reading the Postgres docs properly afterward. `if_not_exists` on the index is not the same as making the index safe.

When a concurrent build fails, it doesn't clean up after itself:

> If a problem arises while scanning the table, such as a deadlock or a uniqueness violation in a unique index, the `CREATE INDEX` command will fail but leave behind an "invalid" index. This index will be ignored for querying purposes because it might be incomplete; however it will still consume update overhead.

So a failed concurrent build leaves a real index object that queries refuse to use but writes still pay for. On the retry, `CREATE INDEX IF NOT EXISTS` sees that object, decides the index exists, and skips. The migration reports success. You now have a permanently invalid index and a green deploy, which is a worse failure than the loud one, because nothing tells you about it.

The documented recovery is manual: "The recommended recovery method in such cases is to drop the index and try again to perform `CREATE INDEX CONCURRENTLY`. (Another possibility is to rebuild the index with `REINDEX INDEX CONCURRENTLY`.)" Invalid indexes are findable with a catalog query:

```sql
SELECT indexrelid::regclass AS index, indrelid::regclass AS table
FROM pg_index
WHERE NOT indisvalid;
```

## What I do differently now

- Treat `disable_ddl_transaction!` as the loudest line in the file. It's the price of `algorithm: :concurrently`, and it means every statement below it has to be independently safe to re-run, because nothing is rolling back for you.
- Add `if_not_exists` / `if_exists` to `add_column` and `remove_column` in any migration that isn't transactional.
- Keep a non-transactional migration to one statement where I can. Two statements without a transaction is two chances to end up in a state Rails can't reason about. A column migration and an index migration as separate files each fail cleanly on their own.
- Check for invalid indexes after any deploy where a concurrent build didn't obviously succeed.
- Set a `lock_timeout` for migration statements, so a migration that can't get its lock fails fast instead of queueing traffic behind it. It defaults to `0`, meaning wait forever, and the docs note that if `statement_timeout` is also set and is lower, it fires first and makes `lock_timeout` pointless.
- Keep schema changes and data backfills in separate migrations, and run anything touching a high-traffic table during a quieter window.
