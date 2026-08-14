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

State the symptom and the stakes. Do not state the diagnosis or the fix. Both are the payoff of later sections, and handing them over in paragraph one leaves the rest of the post with nothing to reveal. The model is the opening of `self-contained-html-snapshots-without-puppeteer.md`: what he needed, why the obvious options failed, then "It was harder than I expected, and the roadblocks were genuinely bizarre." Problem, constraint, stop.

- Do not name a cause the post later derives. Calling a table "one of our busier tables" in the first line gives away a factor a whole section exists to establish. Introduce it where it becomes load bearing.
- Do not narrate a code block you just pasted. "Two statements, plus a `disable_ddl_transaction!` at the top" tells the reader what is already on screen.
- Do not foreshadow importance. "That directive is the one that mattered most" instructs the reader what to care about. Say what you knew at the time instead: "I knew `disable_ddl_transaction!` was required whenever you build an index concurrently, and that was about as far as my understanding went." The admission sets up the same payoff and sounds like him.
- Skip precision flourishes. "the same eight lines of code" counts lines for effect when the code is directly below.
- If code is edited for the post, say exactly how ("with the table and column renamed"), never "more or less as it shipped".

### Transitions

Every handoff must name what the next section actually delivers. A sentence pointing at "what Postgres does to a table during an `ALTER TABLE`" in front of a section on why locks exist at all sends the reader hunting for something two sections away.

- Structural framing has to match how the post is organised. If you tell the reader there were two problems, split them the way the sections split them. Splitting the same incident chronologically when the sections split it by who got hurt makes both halves read wrong.
- Do not leave a dangling promise. "for reasons I'll get to" defers a question with no payoff in sight. A setup line that hands straight into the section below it is a different thing and is fine: "Before getting to the problem and the fix, let's go back to the beginning: what a lock is, and what it does."
- Section openers should not announce what the section is about to do. "Before getting into how Postgres locks a table, a word on why locking exists at all" is a sentence the heading already covers.

### Keep the language plain

He writes in short sentences made of everyday words, with something concrete doing something concrete. "I opened the codebase, started writing code, and shipped things." "You open a Rails project and there's a shape to everything." "Command-click in the editor and it shrugs." "The meeting happens at the wrong time for the Toronto user."

- Prefer a thing doing something over an abstract noun phrase about it. "One problem hit everyone else using that table" beats "One problem was what the migration did to everything else".
- Cut constructions that draw attention to the writing. "Working out the first one sent me further back than I expected" is doing a voice; "I had to go back further than I expected" is just saying it.
- Simple beats clever every time. If a plainer word carries the same meaning, use the plainer word.
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
