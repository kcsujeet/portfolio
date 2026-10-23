/** The four layers a system is drawn in, top to bottom. */
export type Layer = "surface" | "api" | "data" | "infra";

export const LAYER_ORDER: Layer[] = ["surface", "api", "data", "infra"];

export interface LayerRow {
  layer: Layer;
  depth: string;
  line: string;
  stack: string[];
}

/** Fig. 01: a section through a system, from what users see to where it runs. */
export const LAYERS: LayerRow[] = [
  {
    layer: "surface",
    depth: "±0",
    line: "What people see.",
    stack: ["TypeScript", "React", "Next.js", "Vue"],
  },
  {
    layer: "api",
    depth: "−1",
    line: "Contracts between the screen and the data.",
    stack: ["Ruby on Rails", "JSON:API", "REST", "Node.js"],
  },
  {
    layer: "data",
    depth: "−2",
    line: "Schemas, indexes, locks, migrations.",
    stack: ["PostgreSQL", "SQL", "Drizzle", "D1"],
  },
  {
    layer: "infra",
    depth: "−3",
    line: "Where it all runs.",
    stack: ["Docker", "AWS", "Cloudflare Workers", "R2"],
  },
];

export interface ExpItem {
  id: string;
  years: string;
  place: string;
  role: string;
  company: string;
  lede: string;
  points: string[];
  /** Layers this role touched, drawn as filled squares. */
  layers: Layer[];
}

export const EXPERIENCE: ExpItem[] = [
  {
    id: "et",
    years: "2023 - now",
    place: "remote",
    company: "Event Temple",
    role: "Senior Full-Stack Engineer",
    lede: "Hospitality SaaS. I build features end to end, from the database to the UI.",
    points: [
      "Led the Rails API to V2 on JSON:API: resource design, serializer caching, one error shape.",
      "Co-led a two-year AngularJS → React/Next.js migration.",
      "Built a zero-downtime migration engine; 1.5M+ records moved across schemas, transactionally.",
      "Built product features end to end, including Proposals and Guest Portal (part of $2M+ in enterprise contracts) and, most recently, the Booking Engine.",
      "Traced and fixed PostgreSQL table-level lock contention during production schema migrations.",
    ],
    layers: ["surface", "api", "data", "infra"],
  },
  {
    id: "lf",
    years: "2021 - 2022",
    place: "remote",
    company: "Legalfit",
    role: "Front-End Developer",
    lede: "Led Vue 2 → Vue 3 with TypeScript, and the tools clients built with.",
    points: [
      "Standardized component patterns and type safety across the migration.",
      "Drag-and-drop form builder with rich text, from requirements to ship.",
      "Wired builders to Django REST APIs with validation and live editing.",
    ],
    layers: ["surface", "api"],
  },
  {
    id: "tv",
    years: "2019 - 2021",
    place: "Lalitpur, NP",
    company: "Tekvortex",
    role: "Software Engineer",
    lede: "Reporting tools in Rails, PostgreSQL and Angular, from the schema to the screen.",
    points: [
      "Tuned queries, views and indexes for relational reporting.",
      "A database client for non-technical users, in Rails and Angular.",
      "D3.js dependency mapping behind ~$500K in annual revenue.",
    ],
    layers: ["surface", "api", "data"],
  },
];

export interface Project {
  id: string;
  name: string;
  tag: "live" | "open source";
  href: string;
  line: string;
  stack: string[];
}

export const PROJECTS: Project[] = [
  {
    id: "sublimeread",
    name: "SublimeRead",
    tag: "live",
    href: "https://sublimeread.com",
    line: "Read-along EPUB/PDF reader with on-device TTS. Workers, D1, R2, Stripe billing.",
    stack: ["astro", "workers", "d1", "r2"],
  },
  {
    id: "interactive-rails",
    name: "Interactive Rails",
    tag: "open source",
    href: "https://interactive-rails.sujeetkc45.workers.dev",
    line: "Learn Rails 8 in 58 levels, entirely in the browser.",
    stack: ["rails", "astro", "workers"],
  },
  {
    id: "ilamy",
    name: "Ilamy Calendar",
    tag: "open source",
    href: "https://ilamy.dev",
    line: "React calendar with a ~13 KB core. RFC 5545 recurrence, 100+ locales.",
    stack: ["typescript", "react", "npm"],
  },
  {
    id: "testoise",
    name: "Testoise",
    tag: "open source",
    href: "https://github.com/kcsujeet/testoise",
    line: "RSpec-style lazy let for Bun, Vitest, Jest and Node.",
    stack: ["typescript", "bun"],
  },
  {
    id: "debackground",
    name: "Debackground",
    tag: "live",
    href: "https://debackground.com",
    line: "Background removal that never leaves your browser.",
    stack: ["transformers.js", "wasm"],
  },
  {
    id: "collage",
    name: "Collage Pen",
    tag: "live",
    href: "https://collagepen.com",
    line: "A collage maker that feels like a desktop app.",
    stack: ["canvas", "react"],
  },
];
