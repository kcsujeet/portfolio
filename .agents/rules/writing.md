# Writing

- Never use em dashes (`—`). Use a hyphen (`-`), comma, semicolon, parentheses, or a sentence break instead. This applies to blog posts, UI copy, comments, docs, commit messages, and any other prose you generate.

## Blog posts

Posts must read like Sujeet wrote them, not like an assistant drafted them. Before writing or editing one, read two or three existing posts in `src/content/blog/` and match what you find.

`src/content/blog/` is the authority on voice. There is a wider back catalogue on dev.to under `kcsujeet`, fetchable at `https://dev.to/api/articles?username=kcsujeet` (add `/{id}` for `body_markdown`), but its register varies and not all of it is a model. "JIRA Avatars Not Showing in Chrome on Mac" in particular is not: its jokey asides, rhetorical-question-then-blunt-answer beats, and one word fragments ("Still nothing.", "Boom.") are not his voice and must not be imitated. Do not derive patterns from dev.to that you cannot also find in `src/content/blog/`.

The best reference for the explanatory style is "How to Handle Date and Time Correctly to Avoid Timezone Bugs" (`handling-timezones-without-bugs.md`).

### Structure

Posts come in two shapes. Match the one that fits.

- **Guide.** Opens with `## Introduction` and a short "What We Will Cover" list, then topic sections. See `handling-timezones-without-bugs.md`.
- **Incident.** Opens with `## The Problem` and follows the investigation: `## The Investigation`, `## The Root Cause`, `## The Solution`. See `self-contained-html-snapshots-without-puppeteer.md` and `postgres-locking-and-safe-rails-migrations.md`.

Both shapes close with one concrete takeaways section, named `## Conclusion`, `## Key Takeaways`, `## Final Takeaways`, or `## What I do differently now`. It lists what to actually do. It does not reflect on the post's own value, and it never invites replies or comments, because the site has no comment section.

One closing section, not two. Some older posts stack a prose `## Conclusion` on top of a takeaways list, and that prose paragraph is always the weakest thing on the page ("Performance regressions can be sneaky"). Write the list and stop.

Frontmatter needs `title`, `description`, `pubDate`, and `tags` as an array. No `# H1` in the body, since `PostLayout.astro` renders the title from frontmatter.

### Openings

Give the situation, what went wrong, and what it cost. Never the diagnosis or the fix, which are the payoff of later sections. The model is the top of `postgres-locking-and-safe-rails-migrations.md`:

> I've been writing Ruby on Rails for a while now, and in all that time migrations have never given me trouble. Small hiccups, sure, but nothing serious.
>
> This one looked routine too: add a column and an index to one of our tables, part of a bigger feature. I tested it locally, ran it on staging, everything passed.
>
> Then came the part of deploying to production. I expected it to go just as smoothly there, but the deployment failed: the migration had stopped partway through. When I ran it again, it errored out immediately, before it could do anything at all. Deploys were blocked, and I had no idea why, because nothing about this change looked like it could break anything.
>
> So I started digging, and went down a rabbit hole of Postgres locks and Rails migration internals. That's what this post is about.

The arc is: his baseline, the routine change, the expectation breaking, the digging, what the post is. Each paragraph is one beat.

- Start with his baseline before the incident: how long he has been doing this and that it had always been uneventful. The surprise in paragraph three only lands because paragraph one established the routine.
- State the expectation and let the contrast carry the surprise: "I expected it to go just as smoothly there, but...". Say surprise once; if the expectation-then-break structure is doing it, do not also write "I was surprised".
- Report the failure at the altitude he experienced it. He watched a deployment fail; the migration stopping partway is the explanation, not the headline. "the deployment failed: the migration had stopped partway through", not "the migration stopped partway through".
- Close the intro by saying plainly what the post is: "So I started digging, and went down a rabbit hole of Postgres locks and Rails migration internals. That's what this post is about." Naming the topic areas is not a spoiler; naming the diagnosis is.
- Place the work in real context. "part of a bigger feature" beats a change floating free with no reason to exist.
- Say what it cost. "Deploys were blocked" is why a reader should care. Symptoms with no stakes are trivia.
- Describe the symptom concretely without naming the cause. "failed immediately, before it could do anything at all" shows the `PG::DuplicateColumn` behaviour without spending the reveal.
- Plain does not mean bare. Stripping an opening down to clipped fragments takes the texture out along with the padding. Write plain sentences that carry real detail, not telegraphic ones.
- Counting the problems is fine; compressing them into a balanced pair is not. "Two separate problems: one hit everyone else using that table, the other hit the migration itself" reads as constructed. Give each problem its own plain sentence instead: "It turned out there were two separate problems hiding in this migration. The first was about Postgres locks: what happens when a schema change touches a busy table. The second was about Rails: what happens when you disable the transaction that would normally roll back a failed migration."
- Do not name a cause the post later derives. Calling a table "one of our busier tables" in the first line gives away a factor a whole section exists to establish. Introduce it where it becomes load bearing.
- Do not narrate a code block you just pasted. "Two statements, plus a `disable_ddl_transaction!` at the top" tells the reader what is already on screen.
- Do not foreshadow importance. "That directive is the one that mattered most" instructs the reader what to care about. Say what you knew at the time instead: "I knew `disable_ddl_transaction!` was required whenever you build an index concurrently, and that was about as far as my understanding went." The admission sets up the same payoff and sounds like him.
- Skip precision flourishes. "the same eight lines of code" counts lines for effect when the code is directly below.
- If code is edited for the post, say exactly how ("with the table and column renamed"), never "more or less as it shipped".

### Transitions

Every handoff must name what the next section actually delivers. A sentence pointing at "what Postgres does to a table during an `ALTER TABLE`" in front of a section on why locks exist at all sends the reader hunting for something two sections away.

- Introduce a concept before leaning on it. Do not jump from the symptom straight to "understanding Postgres locking" when nothing has told the reader locks are involved at all. Spell out the link: "To work out what had happened, I first had to understand what a migration actually does to a table while it runs, and that comes down to locking."
- Do not leave a dangling promise. "for reasons I'll get to" defers a question with no payoff in sight. A setup line that hands straight into the section below it is a different thing and is fine: "Before getting to the problem and the fix, let's go back to the beginning: what a lock is, and what it does."
- Section openers should not announce what the section is about to do. "Before getting into how Postgres locks a table, a word on why locking exists at all" is a sentence the heading already covers.

### Keep the language plain

He writes in short sentences made of everyday words, with something concrete doing something concrete. "I opened the codebase, started writing code, and shipped things." "You open a Rails project and there's a shape to everything." "Command-click in the editor and it shrugs." "The meeting happens at the wrong time for the Toronto user."

- Prefer a thing doing something over an abstract noun phrase about it. "The migration didn't finish" beats "the migration's execution was incomplete".
- Cut constructions that draw attention to the writing. "Working out the first one sent me further back than I expected" is doing a voice; "I had to go back further than I expected" is just saying it.
- Simple beats clever every time. If a plainer word carries the same meaning, use the plainer word.
- One-sentence paragraphs are for lead-ins to a code block or quote ("You get a queue:"), not a rhythm. A run of them reads as staged; merge related sentences into normal paragraphs.
- Accuracy still wins over simplicity. When a simple phrasing is wrong, fix the meaning first, then make the correct version plain. Do not keep a sentence because it sounds good.

### How he explains things

- Build one concrete scenario with named places and real values, then reuse it for the whole post. The timezone post runs Tokyo and Toronto, `2025-01-01`, JST and UTC-5 through every example.
- Walk a failure as a bulleted causal chain, one step per bullet, ending on the consequence to the user. "A user in Tokyo schedules an online event for `2025-01-01`. / The system stores just `2025-01-01` without specifying a timezone. / ... / This could lead to the Toronto user missing the event entirely."
- Show both sides of the wire when it applies, labelled `Server-Side (Ruby)` and `Client-Side (JavaScript)`, and put the real result in an output comment: `# Output: "Renewal Date (JST): 2025-01-01"`.
- Name the reader's confusion, as a heading or a sentence, then answer it plainly. "But how does ISO8601 format help to avoid timezone issues?" "You might be wondering why this format prevents timezone issues." "This is perfectly fine. This is what we want, a UTC timestamp. Don't get confused."
- Use `> **NOTE**:` blockquotes for caveats that would otherwise break the flow.
- Point at a real product when it solves the problem well. "I really like how `Stripe` handles this."
- Say so when there is no single right answer. "There's no single best way to display date-time in the front-end as it largely depends on product requirements and team consensus."
- Build up from the fundamentals before the problem, so a reader who does not already know the concept can follow the fix. If a post says the table was locked, the reader needs to know what a lock is and what kinds exist before that means anything. Those primer sections are for the reader.
- Admit what you did not know, and hedge honestly rather than projecting certainty. "I knew this meant `useWatch` gives better performance but I wasn't sure in what way or by how much." "I'd be lying if I said it was all smooth." "I never traced it down, but the shape fits."
- Name the specific gap, never a general one. He knew what locks were for; what he did not know was which lock a schema change takes and when Postgres rewrites a whole table. Do not write narration that has him learning the basics of his own stack, and do not frame a reader primer as something he had to go and learn.
- Quote and link primary documentation inline rather than asserting from memory.
- Use "we" and "our team" for the work context, "I" for the investigation and the conclusions.

### Never write these

Each one is a reason a post reads as machine written:

- Reader directives: "it's worth noting", "worth internalizing", "worth reading carefully". State the fact and move on.
- Summary tags that restate the sentence before them: "That's the mechanism that...", "That's the whole story", "That's the whole reason".
- Aphoristic closers: "Every other lock mode lets plain reads through. This one doesn't."
- Negation pairs used for rhythm: "It isn't caution, it's that...", "None of this is X, and none of it is Y".
- Filler intensifiers: genuinely, simply, actually, really, exactly, comprehensive, crucial. Delete unless the word is load bearing.
- Closing sections that reflect on why the post was worth writing, in the register of "None of this is obscure trivia, it's just invisible until it bites you". A closing section is expected, but it lists actions, not reflections.
