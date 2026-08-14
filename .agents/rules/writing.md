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

### How he explains things

- Build one concrete scenario with named places and real values, then reuse it for the whole post. The timezone post runs Tokyo and Toronto, `2025-01-01`, JST and UTC-5 through every example.
- Walk a failure as a bulleted causal chain, one step per bullet, ending on the consequence to the user. "A user in Tokyo schedules an online event for `2025-01-01`. / The system stores just `2025-01-01` without specifying a timezone. / ... / This could lead to the Toronto user missing the event entirely."
- Show both sides of the wire when it applies, labelled `Server-Side (Ruby)` and `Client-Side (JavaScript)`, and put the real result in an output comment: `# Output: "Renewal Date (JST): 2025-01-01"`.
- Name the reader's confusion, as a heading or a sentence, then answer it plainly. "But how does ISO8601 format help to avoid timezone issues?" "You might be wondering why this format prevents timezone issues." "This is perfectly fine. This is what we want, a UTC timestamp. Don't get confused."
- Use `> **NOTE**:` blockquotes for caveats that would otherwise break the flow.
- Point at a real product when it solves the problem well. "I really like how `Stripe` handles this."
- Say so when there is no single right answer. "There's no single best way to display date-time in the front-end as it largely depends on product requirements and team consensus."
- Admit what you did not know, and hedge honestly rather than projecting certainty. "I knew this meant `useWatch` gives better performance but I wasn't sure in what way or by how much." "I'd be lying if I said it was all smooth." "I never traced it down, but the shape fits."
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
