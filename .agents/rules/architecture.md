# Architecture

- Follow the bulletproof-react project structure: <https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md>.
- Translated to Astro:
  - `src/components/`: shared primitives reused across features (e.g. `Mono`, `Reveal`, `SectionHead`, `Pulse`, plus `ui/` for Badge/Button/Card).
  - `src/features/<feature>/components/`: components scoped to a single feature.
  - `src/features/<feature>/{utils,hooks,types}/`: feature-scoped logic. Only create the subfolders a feature actually needs.
  - `src/config/`: app-wide constants and configuration.
  - `src/layouts/`: shared layouts only (e.g. `MainLayout.astro`). Feature-specific layouts live inside the feature folder.
  - `src/styles/`: global styles.
  - `src/pages/`: Astro's router. Required by Astro at this exact path.
  - `src/content/` and `src/content.config.ts`: required Astro paths for Content Collections.
- Imports flow `shared` to `features` to `app`. Features must not import from each other; compose them at the app/page layer.
