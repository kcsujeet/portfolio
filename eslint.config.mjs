// Design-system lint with @shadcn/lint (https://github.com/shadcn-ui/lint).
// Biome stays the main linter and formatter; ESLint runs only these rules.
// The theme comes from components.json -> src/styles/global.css.
import { plugin as shadcn } from "@shadcn/lint";
import tsParser from "@typescript-eslint/parser";
import * as astroParser from "astro-eslint-parser";
import { defineConfig } from "eslint/config";

const rules = {
  "shadcn/no-raw-colors": "error",
  "shadcn/no-inline-styles": "error",
  "shadcn/no-arbitrary-values": "error",
  "shadcn/no-unknown-classes": "error",
};

export default defineConfig([
  { ignores: ["dist/**", ".astro/**", "node_modules/**", ".impeccable/**"] },
  {
    // Officially supported: React components.
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { shadcn },
    rules,
  },
  {
    // Astro is not an officially supported framework for @shadcn/lint.
    // astro-eslint-parser turns templates into a JSX-compatible AST, which
    // the plugin reads. Parser setup from
    // https://github.com/ota-meshi/astro-eslint-parser
    files: ["**/*.astro"],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: [".astro"],
      },
    },
    plugins: { shadcn },
    rules,
  },
]);
