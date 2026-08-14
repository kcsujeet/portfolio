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
- `ROW EXCLUSIVE` is what `INSERT`, `UPDATE`, and `DELETE` take.
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

Postgres doesn't lock the entire `widgets` table. It locks the row being changed. That's why a busy table can handle lots of concurrent updates: one request updating row 123 doesn't prevent another from updating row 456.

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

Notice that the migration never acquired the lock in this story. It's still waiting, and the queue is already forming behind it.

And the queue only exists because the migration is in it. On its own, that long-running query at the front blocks nobody: reads don't conflict with reads, since only `ACCESS EXCLUSIVE` blocks a plain `SELECT`. Every new query would just run alongside it. With the migration in line, the picture changes:

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

Note what isn't on that list: `NOT NULL`. I had absorbed the pre-Postgres-11 folklore that `NOT NULL` plus a default meant a rewrite. It doesn't, and hasn't for years. The trigger is volatility, not nullability. Changing an existing column's type is the other common rewrite, with a narrow exception when the old type is binary coercible to the new one.

So table size matters, but only when the operation does work proportional to the table. A metadata-only change on a huge table is close to instant. A rewrite of that same table can take minutes, and the docs warn it "will temporarily require as much as double the disk space."

Traffic decides whether anyone notices. A lock held for two minutes on a table nobody queries is a non-event. A lock held for a fraction of a second on a busy table can still start a queue, for the reason we saw earlier.

The combination you don't want is all of it at once:

```text
large table + schema change that rewrites + ACCESS EXCLUSIVE + heavy traffic
```

In my case, an empty array is a constant, non-volatile default, so this `ADD COLUMN` never needed a rewrite. The lock was real, just short-lived. Nobody reported anything at the time and I can't say for certain customers felt it, but it's one of our busier tables, and knowing what I know now about that queue I'd guess it wasn't entirely invisible.

## The index was a different story

The migration didn't just add a column. It also created a GIN index, the [index type Postgres provides for array columns](https://www.postgresql.org/docs/current/indexes-types.html). It's what makes queries like "which widgets have tag 5" (`tag_ids @> ARRAY[5]`) fast.

Index builds have their own locking story. A plain `CREATE INDEX` takes a `SHARE` lock, which the [locking docs](https://www.postgresql.org/docs/current/explicit-locking.html) list as "Acquired by `CREATE INDEX` (without `CONCURRENTLY`)." `SHARE` conflicts with `ROW EXCLUSIVE`, the mode every `INSERT`, `UPDATE`, and `DELETE` takes. The [CREATE INDEX docs](https://www.postgresql.org/docs/current/sql-createindex.html) spell out what that feels like: "Other transactions can still read the table, but if they try to insert, update, or delete rows in the table they will block until the index build is finished."

So it sits between the two extremes. `ACCESS EXCLUSIVE` blocks everything including reads. `SHARE` lets reads through and stops writes. On a GIN index over a busy table, that's a long time to accept no writes.

`CONCURRENTLY` avoids it. It takes `SHARE UPDATE EXCLUSIVE` instead, which doesn't conflict with the `ROW EXCLUSIVE` every write takes, so writes keep flowing while the index builds.

The trade-off is that the build takes longer and does more work:

> PostgreSQL must perform two scans of the table, and in addition it must wait for all existing transactions that could potentially modify or use the index to terminate. Thus this method requires more total work than a standard index build and takes significantly longer to complete.

So "concurrent" doesn't mean free. It means: build this index without stopping normal application writes. That's usually what you want in production, but the build itself can take a while. And that brings us to the second problem.

## The Rails part I didn't understand

Normally Rails wraps each migration in a transaction. If the migration fails halfway, Postgres rolls back the earlier statements, and you don't end up with half a migration applied.

But `CREATE INDEX CONCURRENTLY` can't run inside a transaction. The same docs again: "a regular `CREATE INDEX` command can be performed within a transaction block, but `CREATE INDEX CONCURRENTLY` cannot." That's why `disable_ddl_transaction!` is in the file, and that line changes the rules. There is no transaction anymore. The two statements are independent.

And the index is the statement most likely to fail, because of the extra work above. On a busy table, waiting for every in-flight transaction can outlast a deploy timeout. We run on Kubernetes, which adds a second way for it to end badly: a migration that runs long can be cut off when the pod executing it is replaced during a rollout.

Consider what happens when `add_column` succeeds and `add_index` fails:

```text
database:
  tag_ids column     → exists
  tag_ids index      → missing, or invalid (more on that below)

rails:
  schema_migrations  → migration not recorded
```

Now deploy again. Rails sees an unfinished migration and runs it from the beginning. The first statement is `add_column`, the column is already there, and Postgres answers with `PG::DuplicateColumn`. The migration stops immediately. It never even reaches the index.

I never traced the exact failure to a specific pod or retry, so I can't prove that sequence. But the shape fits, and the fix is the tell: the follow-up PR added `if_not_exists: true` to *both* statements, not just the column. You only need it on the index if the index might already be sitting there.

## Why `if_not_exists` helps

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

Rails has supported these options since 6.1, credited to Eileen M. Uchitelle in the [Active Record changelog](https://github.com/rails/rails/blob/v6.1.0/activerecord/CHANGELOG.md): "Adds support for `if_not_exists` to `add_column` and `if_exists` to `remove_column`." If the column already exists, the statement does nothing instead of raising. Same idea for the index. The migration becomes tolerant of a partial previous run.

This is the version that went through, and deploys were unblocked. But there's a catch.

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
