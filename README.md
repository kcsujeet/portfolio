# Sujeet KC's Portfolio

Personal portfolio and blog for Sujeet KC, Senior Full-Stack Engineer based in Coquitlam, BC.

**Live**: [kcsujeet.com.np](https://kcsujeet.com.np)

## Stack

- **[Astro](https://astro.build/)**: static site generator. Pages are Astro components rendered at build time.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: utility-first styling. Design tokens live in `@theme` blocks in `src/styles/global.css`.
- **[Bun](https://bun.sh/)**: package manager, runtime, and test runner.
- **[Biome](https://biomejs.dev/)**: formatter and linter.
- **[@shadcn/lint](https://github.com/shadcn-ui/lint)** (through ESLint): design-system lint for `.astro` and `.tsx` files.

The site is static. Client-side JavaScript is limited to a small scroll-spy `<script>` (active section in the header and the mobile nav) and one React island: the post contents menu on small screens (`MobileToc.tsx`, built on Base UI's Popover).

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
- `bun test`: run content tests
- `bun run typecheck`: run Astro and TypeScript checks
- `bun run lint`: run Biome, then the design-system lint (ESLint + `@shadcn/lint`)
- `bun run lint:ds`: run only the design-system lint
- `bun run format`: format with Biome
- `bun run ci`: lint, typecheck, then build

## Project structure

The codebase follows a [bulletproof-react](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md) inspired layout, translated to Astro. Imports flow `shared` to `features` to `app`; features must not import from each other.

```
src/
├── components/                       shared primitives
│   ├── MobileNav.astro               floating icon nav on phones, plus the shared scroll-spy
│   ├── SectionLabel.astro            narrow left-column label ("02 / about")
│   ├── SiteFooter.astro
│   └── SiteHeader.astro              sticky header with the section nav
├── config/
│   └── constants.ts                  NAME, JOB_TITLE, EMAIL, SOCIAL, START_DATE, years of experience
├── content/
│   └── blog/                         blog posts (Markdown)
├── content.config.ts                 Astro content collection schema
├── features/
│   ├── home/
│   │   ├── components/               Hero, StrataFigure, About, Work, Projects, Contact
│   │   ├── data.ts                   layers, experience, projects
│   │   └── content.spec.ts           content tests
│   └── blog/
│       ├── components/               WritingSection, PostRow, PostLayout, MobileToc
│       └── utils/                    format-date, reading-time
├── layouts/
│   └── MainLayout.astro              HTML shell, SEO, header, footer, mobile nav
├── pages/
│   ├── index.astro                   homepage
│   ├── robots.txt.ts
│   └── blog/
│       ├── index.astro               /blog listing
│       └── [...slug].astro           individual post page
└── styles/
    └── global.css                    design tokens, @utility rules, .prose
```

Agent rules (Claude, Gemini, etc.) live in `.agents/rules/` and are surfaced via symlinked `CLAUDE.md` and `GEMINI.md` at the repo root. Product context for design work is in `PRODUCT.md`.

## Design system

Defined in `src/styles/global.css`. Colors follow the [shadcn](https://ui.shadcn.com/docs/theming) semantic-token convention: values in `:root`, exposed to Tailwind with `@theme inline`.

- **Colors**: `background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring` (each surface with its `-foreground` pair), plus `surface-1`, `surface-2`, `surface-3` for the depth bands in the system figure
- **Radii**: `--radius` with `sm`, `md`, `lg`, `xl` scaled from it
- **Font**: IBM Plex Mono for everything
- **Type scale**: named `--text-*` tokens from the design (`label`, `body`, `lede`, `title`, `heading`, `headline`, `display`, and more), some with paired line height and tracking
- **Spacing and widths**: fluid `--spacing-*` tokens (`gutter`, `section`, `hero-top`, ...) and `--container-*` widths (`page`, `label`, `post`, ...)
- **Custom utilities**: named grid templates (`grid-cols-cards`, `grid-cols-about`, ...), `band-bleed`, `tap` (larger hit area for small links), `no-scrollbar`

Components use semantic utilities throughout (`text-foreground`, `text-muted-foreground`, `bg-accent`, `border-border`, `bg-primary`). No raw palette colors and no arbitrary values: `bun run lint` enforces this with `@shadcn/lint` (`no-raw-colors`, `no-arbitrary-values`, `no-unknown-classes`, `no-inline-styles`). When a value is missing, add a named token instead of an arbitrary class.

The site is light only.

## Sections

- **Hero**: role, headline, and a short intro
- **Fig. 01**: a section through a system (surface, api, data, infra) with the stack at each layer
- **About**: bio and a short facts list (education, focus, hours, next)
- **Work**: each role with a lede, highlights, and markers for the layers it touched
- **Projects**: grid of personal projects with status and stack
- **Writing**: latest 3 posts; the full list lives at `/blog`, posts at `/blog/<slug>`
- **Contact**: email and social links

Navigation:
- **Tablet and desktop** (≥768px): sticky header with section links; the section in view is underlined
- **Phones** (<768px): slim sticky header with the name, and a floating icon pill at the bottom that highlights the section in view

## License

MIT
