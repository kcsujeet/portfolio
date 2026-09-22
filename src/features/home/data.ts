export interface ExpItem {
  id: string;
  year: string;
  role: string;
  company: string;
  where: string;
  impact: string;
  summary: string;
  points: string[];
  stack: string[];
}

export interface Project {
  id: string;
  year: string;
  title: string;
  blurb: string;
  stack: string[];
  href?: string;
  repo?: string;
  state: string[];
  featured?: boolean;
}

export const STACK = [
  "Ruby on Rails",
  "PostgreSQL",
  "REST & JSON:API",
  "Node.js",
  "Docker",
  "AWS",
  "Cloudflare Workers",
  "TypeScript",
  "React.js",
  "Next.js",
];

export const EXPERIENCE: ExpItem[] = [
  {
    id: "et",
    year: "2023 - PRESENT",
    role: "Senior Full-Stack Engineer",
    company: "Event Temple",
    where: "Remote",
    impact: "API & Data Architecture",
    summary:
      "Rails and PostgreSQL work on a hospitality SaaS platform. Led the API modernization to V2 with JSON:API and built a zero-downtime migration engine that moved 1.5M+ records across relational schemas.",
    points: [
      "Led the Rails API migration to V2 with JSON:API standards: REST resource design, serializer caching, and consistent error handling.",
      "Designed and built a zero-downtime data migration engine that moved 1.5M+ records across relational schemas with transactional safety.",
      "Optimized PostgreSQL queries and indexes, and diagnosed and fixed table-level lock contention during production schema migrations.",
      "Shipped the backend for Proposals and Guest Portal, contributing to $2M+ in multi-year enterprise contracts with hotel groups managing 200+ properties.",
      "Co-led the migration of the web platform to React and Next.js with a 2-engineer team, defining the API contracts the new frontend is built on.",
    ],
    stack: [
      "Ruby on Rails",
      "PostgreSQL",
      "JSON:API",
      "Docker",
      "TypeScript",
      "React",
      "Next.js",
    ],
  },
  {
    id: "lf",
    year: "2021 - 2022",
    role: "Front-End Developer",
    company: "Legalfit",
    where: "Remote",
    impact: "Vue 3 Migration",
    summary:
      "Led the Vue 2 to Vue 3 migration with TypeScript. Built rich client-facing tools and integrated with Django backend services.",
    points: [
      "Led the migration from Vue 2 to Vue 3 with TypeScript, standardizing component patterns and type safety.",
      "Built a drag-and-drop form builder with rich text editing, from requirements to ship.",
      "Integrated frontend builders with Django REST APIs, handling data validation and real-time content editing.",
    ],
    stack: ["Vue 3", "TypeScript", "Django", "REST APIs"],
  },
  {
    id: "tv",
    year: "2019 - 2021",
    role: "Software Engineer",
    company: "Tekvortex",
    where: "Lalitpur, NP",
    impact: "Rails & PostgreSQL Backend",
    summary:
      "Built backend systems and reporting tools in Ruby on Rails and PostgreSQL: schema design, query optimization, and a D3.js dependency-mapping product.",
    points: [
      "Optimized PostgreSQL queries, views, and indexes to handle relational reporting.",
      "Designed a database client in Ruby on Rails and Angular for non-technical users.",
      "Developed a D3.js dependency-mapping system that contributed to approximately $500K in annual revenue.",
    ],
    stack: ["Ruby on Rails", "PostgreSQL", "SQL", "D3.js", "TypeScript"],
  },
];

export const PROJECTS: Project[] = [
  {
    id: "sublimeread",
    year: "2026",
    title: "SublimeRead",
    blurb:
      "Read-along reader for EPUBs and PDFs with sentence-level highlighting and on-device text-to-speech. The backend runs on Cloudflare Workers: D1 with Drizzle ORM and versioned migrations for library, progress, highlights, notes, and shelves; R2 for book files and TTS models; better-auth sessions; and Stripe subscriptions through checkout, portal, and webhook endpoints.",
    stack: [
      "Cloudflare Workers",
      "D1",
      "R2",
      "Drizzle ORM",
      "Stripe",
      "TypeScript",
      "React",
      "WASM",
    ],
    href: "https://sublimeread.com",
    state: ["Live"],
    featured: true,
  },
  {
    id: "interactive-rails",
    year: "2026",
    title: "Interactive Rails",
    blurb:
      "Learn Rails 8 by building an e-commerce marketplace through 58 interactive levels across 7 acts. Free, open source, and runs entirely in your browser.",
    stack: [
      "Ruby on Rails",
      "TypeScript",
      "Astro",
      "React",
      "Cloudflare Workers",
    ],
    href: "https://interactive-rails.sujeetkc45.workers.dev",
    repo: "https://github.com/kcsujeet/interactive-rails",
    state: ["Live", "Open Source"],
  },
  {
    id: "testoise",
    year: "2026",
    title: "Testoise",
    blurb:
      "Lightweight, fully type-safe lazy test variables for Bun, Vitest, Jest, and Node. RSpec-style let for JavaScript test runners.",
    stack: ["TypeScript", "Bun", "Vitest", "Jest", "Node.js"],
    repo: "https://github.com/kcsujeet/testoise",
    state: ["Open Source"],
  },
  {
    id: "ilamy",
    year: "2026",
    title: "Ilamy Calendar",
    blurb:
      "Open-source React calendar library, now rebuilt around a tiny ~13 KB gzipped core and an opt-in plugin ecosystem, so you only ship what you use. RFC 5545 recurring events, resource scheduling, drag-and-drop, timezones, and 100+ locales. Published on npm as @ilamy/calendar.",
    stack: ["TypeScript", "React", "RFC 5545", "dnd-kit"],
    href: "https://ilamy.dev",
    repo: "https://github.com/kcsujeet/ilamy-calendar",
    state: ["Live", "Open Source"],
    featured: true,
  },
  {
    id: "collage",
    year: "2026",
    title: "Collage Pen",
    blurb:
      "Browser-based collage maker designed to feel like a native desktop app. Custom Canvas with gesture interactions and high-resolution export.",
    stack: ["Astro", "React", "TypeScript", "Canvas API"],
    href: "https://collagepen.com",
    state: ["Live"],
  },
  {
    id: "debackground",
    year: "2026",
    title: "Debackground",
    blurb:
      "Privacy-first AI background remover that runs entirely in the browser. Transformers.js and WASM. No uploads, no waiting, everything happens locally.",
    stack: ["Transformers.js", "WASM", "TypeScript", "React"],
    href: "https://debackground.com",
    state: ["Live"],
  },
];
