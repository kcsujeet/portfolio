import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// https://astro.build/config
export default defineConfig({
  site: "https://kcsujeet.com.np/",
  server: {
    host: true,
    port: 5000,
  },

  // Astro auto-injects heading ids; rehype-autolink-headings turns each into a
  // hoverable permalink. https://github.com/rehypejs/rehype-autolink-headings
  markdown: {
    // Light-only site, so one light Shiki theme.
    // https://docs.astro.build/en/guides/syntax-highlighting/
    shikiConfig: {
      theme: "github-light",
    },
    rehypePlugins: [
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            class: "heading-anchor",
            "aria-label": "Permalink to this section",
          },
          content: { type: "text", value: "#" },
        },
      ],
    ],
  },

  vite: {
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [tailwindcss()],
  },

  integrations: [sitemap(), react()],
});
