---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/blog/index.astro","src/pages/blog/[...slug].astro"]
---

# Surface brief: site (home, blog index, post)

Mode: Experience (portfolio), with Read for blog posts.
Audience: anyone arriving cold: engineers (including juniors), hiring managers, recruiters. Headline in seconds, depth on demand.
Proof: data.ts experience and metrics, six projects, six posts. No fabricated numbers.
Constraints: no em dashes; AWS reads "in preparation"; real title stays; Bun; bulletproof structure.
History: (1) Engineering Datasheet, rejected as "too complicated" and "wannabe". (2) Green-panel two-column canon, accepted for content but "generic, unmemorable". (3) Re-roll with real previews; the user chose Swiss Poster (.impeccable/mocks/decision/model-pick.png). Content and sections stay as they are; only the look changes.

## Direction contract

THESIS: The site as an International Typographic Style poster: a strict 12-column grid, the name set enormous, black on white with one red square. Refuses the sidebar-plus-list portfolio template and every costume framing.

OWN-WORLD: White paper, near-black ink, one pure red used only as a square mark (the period after the name, the active nav marker, status bullets) and link underlines. Host Grotesk for everything, 800 weight at poster scale with -0.06em tracking, 400-600 for text. No cards, no pills, no rounded corners, no shadows. 2px black rule under the top bar, 1px rules between sections. Dark mode inverts ink and paper; red stays.

STORY: Name and role hit first at poster scale; the numbers row proves it; About, Experience, Projects, Writing follow as grid rows; the page closes on the email set large.

FIRST VIEWPORT: Top bar (name left, nav right, 2px rule). The name "Sujeet / Kc" with a red square period, about 14rem on desktop, flush to the grid's left edge. Below it three columns: role and place (cols 1-4), intro (5-9), status (10-12). The numbers row starts at the bottom edge of the viewport.

FORM: Swiss Poster, IMPECCABLE'S PICK from re-roll 1 of seed 9b6c69f0. Code-led with a real preview as reference. Signature interaction: the name rises into place line by line on load, and the red square in the nav slides to the section in view.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
