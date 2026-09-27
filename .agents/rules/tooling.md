# Tooling

- Always use Bun instead of npm, pnpm, or yarn.
- After any UI change, run `bun run lint` and fix every error. It runs Biome, then `@shadcn/lint` through ESLint (`eslint.config.mjs`) on `.astro` and `.tsx` files: no raw palette colors, no arbitrary values, no unknown Tailwind classes, no inline style objects.
- When a value is missing from the design system, add a named token to the `@theme` block in `src/styles/global.css` (or a named `@utility` for grid templates) instead of writing an arbitrary value like `text-[13px]`.
