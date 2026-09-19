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
  "TypeScript",
  "React.js",
  "Ruby on Rails",
  "PostgreSQL",
  "Next.js",
  "AWS",
  "Node.js",
  "REST & JSON:API",
  "Docker",
  "Tailwind CSS",
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
      "Led the Rails API modernization to V2 with JSON:API standards, decoupling business logic and improving query efficiency. Built a resilient data migration engine moving 1.5M+ records across relational schemas with zero downtime.",
    points: [
      "Led the Rails API migration to V2 with JSON:API standards, designing clean REST endpoints, serializer caching, and consistent error handling.",
      "Architected a zero-downtime data migration engine that safely migrated 1.5M+ records across relational schemas with transactional safety.",
      "Optimized PostgreSQL query execution and resolved table-level lock contention during production schema migrations.",
      "Co-led the full-stack modernization of the web platform to React/Next.js with a 2-engineer team, establishing shared architectural patterns.",
      "Shipped Proposals and Guest Portal, contributing to $2M+ in multi-year enterprise contracts with hotel groups managing 200+ properties.",
    ],
    stack: [
      "Ruby on Rails",
      "PostgreSQL",
      "JSON:API",
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
    impact: "$500K ARR Contribution",
    summary:
      "Built backend systems and data visualization tools in Ruby on Rails and PostgreSQL. Schema design, query optimization, and D3.js mapping.",
    points: [
      "Designed a database client in Angular and Ruby on Rails for non-technical users.",
      "Optimized PostgreSQL queries, views, and indexes to handle relational reporting.",
      "Developed a D3.js dependency-mapping system that contributed to approximately $500K in annual revenue.",
    ],
    stack: ["Ruby on Rails", "PostgreSQL", "SQL", "D3.js", "TypeScript"],
  },
];

export const PROJECTS: Project[] = [
  {
    id: "ilamy",
    year: "2026",
    title: "Ilamy Calendar",
    blurb:
      "Open-source React calendar library, now rebuilt around a tiny ~13 KB gzipped core and an opt-in plugin ecosystem, so you only ship what you use. RFC 5545 recurring events, resource scheduling, drag-and-drop, timezones, and 100+ locales. Published on npm as @ilamy/calendar.",
    stack: ["React", "TypeScript", "Tailwind CSS 4", "dnd-kit", "Motion"],
    href: "https://ilamy.dev",
    repo: "https://github.com/kcsujeet/ilamy-calendar",
    state: ["Live", "Open Source"],
    featured: true,
  },
  {
    id: "sublimeread",
    year: "2026",
    title: "SublimeRead",
    blurb:
      "AI reading app that narrates EPUBs and PDFs with natural voices. Powered by a high-throughput Node.js backend using Hono on Cloudflare Workers, handling text extraction, tokenization pipelines, and real-time audio streaming.",
    stack: ["Node.js", "Hono", "Cloudflare", "WASM", "TypeScript", "React", "Astro"],
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
    stack: ["Ruby on Rails", "Astro", "React", "TypeScript", "Tailwind CSS 4", "Cloudflare"],
    href: "https://interactive-rails.sujeetkc45.workers.dev",
    repo: "https://github.com/kcsujeet/interactive-rails",
    state: ["Live", "Open Source"],
  },
  {
    id: "testoise",
    year: "2026",
    title: "Testoise",
    blurb:
      "Lightweight, fully type-safe lazy test variables for Bun, Vitest, Jest, and Node. Inspired by RSpec.",
    stack: ["TypeScript", "Bun", "Vitest", "Jest", "Node.js"],
    repo: "https://github.com/kcsujeet/testoise",
    state: ["Open Source"],
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
