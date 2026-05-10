import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Authoring convention: full ISO string with the author's local
      // timezone offset at the moment of writing, e.g.
      // `2026-05-10T11:49:04-03:00`. The explicit offset makes the date
      // self-describing; the formatter renders it in build-host local time.
      // Easiest way to get the right value: run `date +"%Y-%m-%dT%H:%M:%S%z"`
      // and paste, inserting a colon in the offset (`-0300` to `-03:00`).
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
      devto: z.string().url().optional(),
    }),
});

export const collections = { blog };
