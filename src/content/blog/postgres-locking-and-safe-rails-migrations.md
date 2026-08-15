---
title: What a Broken Migration Taught Me About PostgreSQL Locking
description: How PostgreSQL locking works, why ALTER TABLE needs a table-level lock instead of a row-level one, and what happened when disable_ddl_transaction! turned one failed migration into a schema state Rails couldn't recover from.
pubDate: 2026-08-13T21:28:29-07:00
tags: ["postgresql", "rails", "ruby", "database"]
---

## The Problem

I've been writing Ruby on Rails for a while now, and in all that time migrations have never given me trouble. Small hiccups, sure, but nothing serious.

This one looked routine too: add a column and an index to one of our tables, part of a bigger feature. I tested it locally, ran it on staging, everything passed.

Then came the part of deploying to production. I expected it to go just as smoothly there, but the deployment failed: the migration had stopped partway through. When I ran it again, it errored out immediately, before it could do anything at all. Deploys were blocked, and I had no idea why, because nothing about this change looked like it could break anything.

So I started digging, and went down a rabbit hole of Postgres locks and Rails migration internals. That's what this post is about, and it starts with the migration itself, table and column renamed:

```ruby
class AddTagIdsToWidgets < ActiveRecord::Migration[7.2]
  disable_ddl_transaction!

  def change
    add_column :widgets, :tag_ids, :integer, array: true, default: []
    add_index :widgets, :tag_ids, using: :gin, algorithm: :concurrently
  end
end
```

I knew why `disable_ddl_transaction!` was there: Postgres doesn't allow `CREATE INDEX CONCURRENTLY` inside a transaction. Beyond that, I hadn't thought much about what Postgres was doing underneath.

It turned out there were two separate problems hiding in this migration. The first was about Postgres locks: what my migration was doing to everyone else using that table while it ran. The second was about Rails: what happens when you disable the transaction that would normally roll back a failed migration, and it's the one that broke the deploy.

Understanding the first problem meant understanding locks. So let's start there.

## So, what is a database lock?

A production database has a lot happening at once. One request might be reading from a table while another is updating it. A background job might be inserting rows at the same time. And somewhere in the middle of all that, a deploy might be running a migration.

Postgres needs a way to make sure those operations don't interfere with each other in unsafe ways. That's what locks are for.

The easiest way to think about a lock is: "I'm doing something with this piece of data. If what you're trying to do would conflict with that, you'll have to wait." If two operations don't conflict, like two `UPDATE`s on different rows, Postgres lets them run at the same time. If they do conflict, one waits until the other finishes.

Most of the time you never notice any of this. Postgres handles it for you. The part that matters for migrations is that Postgres has different kinds of locks, and they don't all block the same things.

At the table level, Postgres has [eight lock modes](https://www.postgresql.org/docs/current/explicit-locking.html). Five of them are enough to follow this post:

- `ACCESS SHARE` is what a plain `SELECT` takes. It conflicts with `ACCESS EXCLUSIVE` only, which is why reads almost never block anything.
- `ROW EXCLUSIVE` is what `INSERT`, `UPDATE`, and `DELETE` take on the table. It doesn't conflict with itself, so writes never block each other at the table level.
- `SHARE` is what a plain `CREATE INDEX` takes. It conflicts with `ROW EXCLUSIVE`, so writes wait while it's held.
- `SHARE UPDATE EXCLUSIVE` is what `CREATE INDEX CONCURRENTLY` takes. It doesn't conflict with reads or writes.
- `ACCESS EXCLUSIVE` is the strongest mode, taken by most forms of `ALTER TABLE`. It conflicts with everything above, including plain reads.

Whether two operations can run at the same time comes down to whether their lock modes conflict. The docs page above has the full conflict table if you want the complete picture.

## Row locks vs. table locks

When your application runs something like:

```sql
UPDATE widgets
SET name = 'New name'
WHERE id = 123;
```

Postgres doesn't lock the entire `widgets` table against everyone. At the table level it takes `ROW EXCLUSIVE`, which doesn't conflict with reads or other writes, and the real exclusivity happens at the row level: it locks just the rows being changed. That's why a busy table can handle lots of concurrent updates: one request updating row 123 doesn't prevent another from updating row 456.

Schema changes are different. When Rails runs `add_column :widgets, :tag_ids, :integer`, it becomes an `ALTER TABLE` in Postgres. You're no longer changing the contents of one row. You're changing the definition of the table itself.

That definition isn't stored per row. It's stored once, in the system catalogs (`pg_attribute`, `pg_class`), and every row in the table is read according to it. There's no way to lock "half" of a definition: you can't have some queries reading the old column layout and some reading the new one at the same time. So Postgres locks the whole table.

The [ALTER TABLE docs](https://www.postgresql.org/docs/current/sql-altertable.html) are blunt about it: "Note that the lock level required may differ for each subform. An `ACCESS EXCLUSIVE` lock is acquired unless explicitly noted." A handful of subforms take something weaker, but the default is the heaviest lock available, and `ADD COLUMN` takes the default.

`ACCESS EXCLUSIVE` is the strongest table-level lock Postgres has. Per the [explicit locking docs](https://www.postgresql.org/docs/current/explicit-locking.html), it "conflicts with locks of all modes" and guarantees "the holder is the only transaction accessing the table in any way." Unlike every other lock mode, it also blocks plain `SELECT` queries: "Only an `ACCESS EXCLUSIVE` lock blocks a `SELECT` (without `FOR UPDATE/SHARE`) statement."

This was the first part I hadn't fully appreciated. I knew an `ALTER TABLE` needed a lock. I didn't realize a small schema change could block ordinary reads from the table.

## The dangerous part isn't the lock itself

Suppose the application is using `widgets` constantly, and a query is already running when the migration starts. The migration asks Postgres for an `ACCESS EXCLUSIVE` lock. The query that was already running gets to finish. The migration waits.

So far, that's reasonable. But now another request arrives and wants to read from `widgets`. The migration is still waiting for its lock, and the new query ends up waiting behind the migration.

You get a queue:

```text
existing query   → running, finishes normally
migration        → waiting for ACCESS EXCLUSIVE
new SELECT       → waiting behind the migration
another SELECT   → waiting
another request  → waiting
```

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

A new `SELECT` wants an `ACCESS SHARE` lock. That conflicts with the `ACCESS EXCLUSIVE` the migration is *waiting* for, not just locks already held, so it joins the queue instead of jumping ahead.

Notice that the migration never acquired the lock in this story. It's still waiting, the queue is already forming behind it, and the queue exists only because the migration is in it. On its own, that long-running query at the front blocks nobody: reads don't conflict with reads, since only `ACCESS EXCLUSIVE` blocks a plain `SELECT`. Every new query would just run alongside it. With the migration in line, the picture changes:

- A user loads a page that reads from `widgets`.
- Normally that page's query would run immediately, alongside whatever else is reading the table.
- But it conflicts with the `ACCESS EXCLUSIVE` request already waiting, so it queues behind the migration.
- Nothing moves until the long query finishes and the migration takes and releases its lock.
- If that takes longer than the request timeout, the user gets an error page.

Multiply that by every request touching the table while the migration waits. The long query at the front was harmless on its own. The migration's pending lock is what turned it into something the whole table has to wait for.

## Does adding a column rewrite the whole table?

This is where I had another misconception. I'd heard the usual warning: be careful with `ALTER TABLE`, because Postgres might rewrite the entire table. That's true for some operations, but not for every `ADD COLUMN`, and the [docs](https://www.postgresql.org/docs/current/sql-altertable.html) are precise about which is which:

> When a column is added with `ADD COLUMN` and a non-volatile `DEFAULT` is specified, the default value is evaluated at the time of the statement and the result stored in the table's metadata [...] making the `ALTER TABLE` very fast even on large tables. If no column constraints are specified, NULL is used as the `DEFAULT`. In neither case is a rewrite of the table required.

What does force a rewrite:

> Adding a column with a volatile `DEFAULT` (e.g., `clock_timestamp()`), a stored generated column, an identity column, or a column with a domain data type that has constraints will cause the entire table and its indexes to be rewritten.

"Volatile" is Postgres's term for a function that [can return different results on successive calls with the same arguments](https://www.postgresql.org/docs/current/xfunc-volatility.html). `clock_timestamp()` is volatile: call it twice and you get two different values. `random()` is another. An empty array, `0`, or `'pending'` is not: the value is the same no matter when you evaluate it.

That difference is what decides the rewrite. With a constant default, Postgres evaluates it once, stores that single value in the table's metadata, and hands it back whenever an existing row is read. No row has to change. With a volatile default, every row is supposed to get its own value, so there is no single value to store. The only way to give each row its own result is to visit every row and write a value into it: a full table rewrite.

Note what isn't on the list of rewrite triggers: `NOT NULL`. I had absorbed the pre-Postgres-11 folklore that `NOT NULL` plus a default meant a rewrite. It doesn't, and hasn't for years. The trigger is volatility, not nullability. Changing an existing column's type is the other common rewrite, with a narrow exception when the old type is binary coercible to the new one.

## So, how bad does it get?

How much a schema change hurts comes down to three things stacking: what the operation has to do, how big the table is, and how much traffic it gets while the lock is held. The operation is the part we just covered: Postgres either updates metadata, or it visits every row.

Table size only matters for the second kind. Visiting every row costs time in proportion to how many rows there are. A metadata-only change is close to instant no matter how big the table is, but a rewrite of a table with tens of millions of rows can take minutes, and the docs warn it "will temporarily require as much as double the disk space."

Traffic is the third factor, and it decides whether anyone notices. A lock held for two minutes on a table nobody queries is a non-event. A lock held for a fraction of a second on a busy table can still start a queue, for the reason we saw earlier.

The combination you don't want is all of it at once:

```text
large table + schema change that rewrites + ACCESS EXCLUSIVE + heavy traffic
```

In my case, an empty array is a constant, non-volatile default, so this `ADD COLUMN` never needed a rewrite. The lock was real, just short-lived. Nobody reported anything at the time and I can't say for certain customers felt it, but it's one of our busier tables, and knowing what I know now about that queue I'd guess it wasn't entirely invisible.

## The index was a different story

The migration didn't just add a column. It also created an index. You might be wondering about the `using: :gin` in that line, so a quick word on index types first.

B-tree is the default index type and almost always what you're using. It handles [equality and range queries](https://www.postgresql.org/docs/current/indexes-types.html) on things that sort: `WHERE id = 5`, `WHERE created_at > ...`. Postgres has five other index types (Hash, GiST, SP-GiST, GIN, and BRIN) for queries that don't fit that shape.

An array column is one of those. The question you ask it isn't "which rows equal this array," it's "which rows contain this value." That's what GIN is for: it keeps an index entry per element of the array, so a query like "which widgets have tag 5" (`tag_ids @> ARRAY[5]`) finds its rows without scanning the table. The docs call these "inverted indexes," "appropriate for data values that contain multiple component values, such as arrays." That's why the migration says `using: :gin`.

Okay, back to the story. The index type won't matter again; what does matter is that the migration builds an index on a busy table, and index builds have their own locking story.

While a plain `CREATE INDEX` runs, reads keep working but writes wait. That's because it takes a [`SHARE` lock](https://www.postgresql.org/docs/current/explicit-locking.html), and `SHARE` conflicts with `ROW EXCLUSIVE`, the lock every write takes. The [CREATE INDEX docs](https://www.postgresql.org/docs/current/sql-createindex.html) put it plainly: "Other transactions can still read the table, but if they try to insert, update, or delete rows in the table they will block until the index build is finished."

That's friendlier than `ACCESS EXCLUSIVE`, which blocks reads too, but it still means the table takes no writes for as long as the build runs. A busy table can't afford that.

`CONCURRENTLY` avoids it. It takes `SHARE UPDATE EXCLUSIVE` instead, which doesn't conflict with reads or writes, so traffic keeps flowing while the index builds.

The trade-off is that the build takes longer and does more work:

> PostgreSQL must perform two scans of the table, and in addition it must wait for all existing transactions that could potentially modify or use the index to terminate. Thus this method requires more total work than a standard index build and takes significantly longer to complete.

So "concurrent" doesn't mean free. It means: build this index without stopping normal application writes. That's usually the right trade in production. But it leaves the migration with one slow statement in it, and concurrent builds come with one more rule. Those two together are the second problem.

## The Rails part I didn't understand

The rule is in the [CREATE INDEX docs](https://www.postgresql.org/docs/current/sql-createindex.html): "a regular `CREATE INDEX` command can be performed within a transaction block, but `CREATE INDEX CONCURRENTLY` cannot."

That matters because of what the transaction was doing for you. Normally Rails wraps each migration in one: if the migration fails halfway, Postgres rolls back the earlier statements, and you don't end up with half a migration applied. To build its index concurrently, this migration had to turn that off. That's what `disable_ddl_transaction!` does. There is no transaction anymore, the two statements are independent, and nothing rolls anything back.

And the index is the statement most likely to fail, because it's the slow one. On a busy table, waiting for every in-flight transaction can take longer than a deploy is allowed to run, and anything that kills the deploy mid-build takes the migration with it. For us that's Kubernetes replacing the pod during a rollout, but a CI timeout or a cancelled deploy does the same.

Consider what happens when `add_column` succeeds and `add_index` fails:

```text
database:
  tag_ids column     → exists
  tag_ids index      → missing, or invalid (more on that below)

rails:
  schema_migrations  → migration not recorded
```

Now deploy again. Rails sees an unfinished migration and runs it from the beginning. The first statement is `add_column`, the column is already there, and Postgres answers with `PG::DuplicateColumn`.

This is the error from the start of this post. It's why the retry failed immediately, before it could do anything at all: the migration dies on its first statement and never reaches the index.

Deploy setups often retry on their own, and ours does: the migration runs as part of the rollout, so a restarted pod runs it again without anyone touching anything. That's why deploys stayed blocked: every attempt, automatic or manual, ran the same migration into the same existing column and hit the same wall. It stays that way until someone changes the migration or the schema by hand.

I can't prove that's exactly what happened; I never traced it down to a specific run or retry. What I could see was the state itself: the column existed, the migration wasn't recorded, and every deploy died on the same error.

The way out was to make the migration okay with that state: if something it creates is already there, skip it and move on. I reverted the deploy and shipped a follow-up PR with one change, `if_not_exists: true` on both statements:

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

## Why `if_not_exists` helps

With `if_not_exists: true`, a statement whose work is already done does nothing instead of raising. Rails has supported it since 6.1, credited to Eileen M. Uchitelle in the [Active Record changelog](https://github.com/rails/rails/blob/v6.1.0/activerecord/CHANGELOG.md): "Adds support for `if_not_exists` to `add_column` and `if_exists` to `remove_column`."

The guard on the column is what unblocked us: `add_column` now walks past the column that's already there instead of raising `PG::DuplicateColumn`, and the migration finally gets to run its second statement.

The guard on the index covers two cases. If the first run finished the build but died before recording the migration, the retry skips a perfectly good index and moves on; that case is harmless. If the build itself failed partway, the retry skips whatever the failure left behind, and that case isn't.

This is the version that went through. But there's a catch, and it's the second case.

## `if_not_exists` doesn't make a failed index safe

A concurrent index build that fails doesn't clean up after itself. From the [docs](https://www.postgresql.org/docs/current/sql-createindex.html):

> If a problem arises while scanning the table, such as a deadlock or a uniqueness violation in a unique index, the `CREATE INDEX` command will fail but leave behind an "invalid" index. This index will be ignored for querying purposes because it might be incomplete; however it will still consume update overhead.

So a failed build leaves a real index object behind:

```text
index exists → but is invalid → queries ignore it → writes still pay for it
```

Now retry with `if_not_exists: true`. Postgres sees an index with that name, skips the creation, and the migration succeeds. Green deploy, invalid index. That's arguably worse than the original failure, because the problem is now hidden.

The documented recovery is manual: "The recommended recovery method in such cases is to drop the index and try again to perform `CREATE INDEX CONCURRENTLY`. (Another possibility is to rebuild the index with `REINDEX INDEX CONCURRENTLY`.)" You can find invalid indexes with:

```sql
SELECT indexrelid::regclass AS index, indrelid::regclass AS table
FROM pg_index
WHERE NOT indisvalid;
```

That query is now one of the first things I check after a failed concurrent index build.

## What I do differently now

The biggest change isn't a particular Rails option. It's the questions I ask before running a migration against a busy table:

- What lock does this operation take, and how long might it hold it?
- Does Postgres need to rewrite the table? How large is the table, and how much traffic does it get?
- Can the migration be safely retried if it fails halfway through?

And the habits that fall out of the answers:

- Treat `disable_ddl_transaction!` as the loudest line in the file. It gives up the safety net, so every statement below it has to be safe to run on its own.
- Keep non-transactional migrations to one statement where possible. A column migration and an index migration as separate files each fail cleanly on their own.
- Add `if_not_exists` / `if_exists` to `add_column` and `remove_column` in any migration that isn't transactional.
- Check for invalid indexes after any deploy where a concurrent build didn't obviously succeed.
- Set a `lock_timeout` for migration statements. It defaults to `0`, meaning wait forever, and a migration waiting forever is the thing that builds a queue in the middle of production traffic. Failing fast and retrying later is safer. The docs note that if `statement_timeout` is also set and is lower, it fires first and makes `lock_timeout` pointless.
- Keep schema changes and data backfills in separate migrations, and run anything touching a busy table during a quieter window.
