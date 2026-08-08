# Sujeet KC's Portfolio

Personal portfolio site for Sujeet KC, Senior Full-Stack Engineer based in Halifax.

**Live**: [kcsujeet.com.np](https://kcsujeet.com.np)

## Stack

- **[Astro](https://astro.build/)**: static site generator. Pure Astro components, no JS framework runtime ships to the client.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: utility-first styling. Design tokens defined in `@theme` blocks in `src/styles/global.css`.
- **[Bun](https://bun.sh/)**: package manager and runtime.
- **[Biome](https://biomejs.dev/)**: formatter and linter.

The site is fully static. Zero React (or other JS framework) ships to the browser. The only client-side JavaScript is a small inline `<script>` block in `side-rail.astro` for scroll-position tracking and the native browser handling of `<details>` accordions.

## Getting started

Prerequisites: [Bun](https://bun.sh/) installed.

```bash
git clone https://github.com/kcsujeet/portfolio.git
cd portfolio
bun install
bun run dev
```

Open [http://localhost:5000](http://localhost:5000).

## Scripts

- `bun run dev`: start dev server (port 5000)
- `bun run build`: build the static site to `dist/`
- `bun run preview`: preview the production build
- `bun run typecheck`: run TypeScript checks
- `bun run lint`: run Biome linter
- `bun run format`: format with Biome
- `bun run ci`: lint, typecheck, then build

## Project structure

The codebase follows a [bulletproof-react](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md) inspired layout, translated to Astro. Imports flow `shared` to `features` to `app`; features must not import from each other.

```
src/
├── components/                       shared primitives
│   ├── ui/                           Badge, Button, Card
│   ├── Mono.astro                    uppercase-mono label
│   ├── Pulse.astro                   pulsing dot indicator
│   ├── Reveal.astro                  CSS-keyframe fade-in wrapper
│   └── SectionHead.astro             numbered section heading
├── config/
│   └── constants.ts                  JOB_TITLE, NAME, SITE_URL, START_DATE
├── content/
│   └── blog/                         blog posts (Markdown)
├── content.config.ts                 Astro content collection schema
├── features/
│   ├── home/components/              Hero, About, Experience, Projects, Contact, Footer, SideRail
│   └── blog/
│       ├── components/               WritingSection, PostRow, PostLayout
│       └── utils/                    format-date, reading-time
├── layouts/
│   └── MainLayout.astro              HTML shell, SEO, ambient atmosphere layer
├── pages/
│   ├── index.astro                   homepage
│   ├── robots.txt.ts
│   └── blog/
│       ├── index.astro               /blog listing
│       └── [...slug].astro           individual post page
└── styles/
    └── global.css                    design tokens, @utility rules, .prose, keyframes
```

Agent rules (Claude, Gemini, etc.) live in `.agents/rules/` and are surfaced via symlinked `CLAUDE.md` and `GEMINI.md` at the repo root.

## Design system

Defined in `src/styles/global.css` via Tailwind v4's `@theme inline` directive. Follows the [shadcn](https://ui.shadcn.com/) semantic-token convention:

- **Colors**: `background`, `foreground`, `primary`, `secondary`, `success`, `info`, `warning`, `destructive`, `muted`, `accent`, `card`, `border`, `input`, `ring`, plus `surface-1` and `surface-2`
- **Radii**: `--radius` with `sm`, `md`, `lg`, `xl` variants
- **Fonts**: Geist (sans), Geist Mono
- **Custom utilities**: `radial-center`, `radial-from-top`, `radial-from-top-left`, `radial-from-right`, `radial-from-bottom` for ambient gradient backgrounds
- **Animation**: `animate-reveal` keyframe driven by `animation-delay` for staggered fade-ins on initial paint

Components use semantic Tailwind utilities throughout (`text-primary`, `bg-card`, `border-border`, `text-foreground/65`). No arbitrary `[var(--color)]` values.

## Sections

- **Hero**: Display name, intro, CTA links (View projects, Let's talk)
- **About**: Bio paragraphs, education / focus / location grid, core stack chips
- **Experience**: Native `<details>` cards with role, impact pill, summary, expandable bullets, and stack tags
- **Projects**: Featured + grid layout, with status pills (Live, Open Source) and tech chips
- **Writing**: Latest 3 blog posts; full collection lives at `/blog` with individual `/blog/<slug>` pages
- **Contact**: Email card with hover glow, social links, inquiry status

Side rail navigation:
- **Desktop** (≥1024px): fixed left rail with numbered section labels and an active highlight that follows scroll position
- **Mobile / tablet** (<1024px): fixed bottom-centered icon pill

## License

MIT
