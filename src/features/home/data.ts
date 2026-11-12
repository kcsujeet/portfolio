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
      "Shipped the Booking Engine, Proposals and Guest Portal end to end, part of $2M+ in multi-year contracts with hotel groups running 200+ properties.",
      "Built a reusable data migration system that moves up to 1.5M records across relational schemas in transactions, so new clients onboard with zero downtime.",
      "Led the Rails API's move to V2 on JSON:API, used by our frontend and by external integrators: resource design, versioned endpoints, one error shape.",
      "Co-led a two-year AngularJS to React/Next.js migration, replacing the app piece by piece with no disruption to customers.",
      "Found and fixed PostgreSQL lock contention that blocked a production deploy, then wrote up safe concurrent index builds.",
      "Mentor engineers and set review patterns adopted across the Rails and React codebases, plus Claude Code tooling for review, API scaffolding and tests.",
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
      "Built a drag-and-drop form builder with rich text editing, working directly with clients on requirements.",
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
      "Extended Rails and PostgreSQL APIs: schema design, views, indexes and query tuning for relational reporting.",
      "Designed a Rails and Angular database client that let non-technical users browse and manage data without SQL.",
      "Built a D3.js dependency map, behind ~$500K in annual revenue, for relationships people used to trace by hand in SQL.",
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
    id: "passport-photo-wiz",
    name: "Passport Photo Wiz",
    tag: "live",
    href: "https://passportphotowiz.com",
    line: "Passport photos for 24 countries with AI background removal. A Pro plan on Pages Functions, D1 and Stripe.",
    stack: ["astro", "mediapipe", "d1", "stripe"],
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
    id: "collage",
    name: "Collage Pen",
    tag: "live",
    href: "https://collagepen.com",
    line: "A collage maker that feels like a desktop app.",
    stack: ["canvas", "react"],
  },
];
