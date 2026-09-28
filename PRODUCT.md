# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A general audience with no single target. Visitors include hiring managers and engineering leads, recruiters, other engineers (including junior engineers curious about his path and work), and anyone who lands on the site from GitHub, LinkedIn, dev.to, or a project page. The site must give a skimmer the headline in seconds and reward a technical reader who digs in.

## Product Purpose

Personal site and blog for Sujeet Kc, a Senior Full-Stack Engineer (7+ years) based in Coquitlam, BC. It presents his experience, personal projects, and writing, and signals his current direction as a full-stack engineer: going deeper into backend and infrastructure work (Rails, PostgreSQL, API design, data migrations, AWS, Cloudflare Workers). Success means a visitor leaves understanding what he builds, how he thinks, and how to reach him.

## Positioning

A full-stack engineer whose weight has shifted to the backend: API contracts, schemas, production migrations, and the infrastructure that runs them, backed by concrete shipped work (a zero-downtime migration engine that moved 1.5M+ records, the JSON:API V2 modernization, live products on Workers/D1/R2) and incident-style writing about real production problems.

## Operating Context

Static Astro site, read on desktop and phones. Visitors arrive cold from links. The blog is long-form technical writing (guides and incident write-ups) with code blocks and a table of contents.

## Capabilities and Constraints

- Astro 7, Tailwind CSS 4, a small React island (mobile TOC, Base UI). Bun for all tooling.
- Content lives in `src/features/home/data.ts` and `src/content/blog/`; `content.spec.ts` guards backend-first ordering, real titles, and no em dashes.
- Bulletproof-react structure: shared primitives in `src/components/`, feature components in `src/features/<feature>/`.
- AWS status: preparing for AWS Certified Developer - Associate, no exam date. Never present it as earned.
- Not actively job hunting (confirmed 2026-09-28). Do not add "open to roles", "available for hire", or similar availability claims.

## Brand Commitments

- Name: Sujeet Kc. Title: Senior Full-Stack Engineer (real title, do not change).
- No em dashes anywhere in copy.
- Plain, concrete voice; see `.agents/rules/writing.md`.
- Visual authority (2026-09-27): the user's own Claude Design file, project 33f14774-7a6e-4473-844e-7f9efba17e58, `Portfolio.dc.html`. IBM Plex Mono, cool gray sheet, strata layers (surface, api, data, infra), dark contact block. Light only.
- Rejected earlier: a datasheet concept ("too complicated", "wannabe", confusing jargon like part numbers and "revisions") and a generic green two-column layout ("unmemorable"). Keep labels plain.

## Evidence on Hand

- Experience: Event Temple (2023 - present), Legalfit (2021 - 2022), Tekvortex (2019 - 2021), with metrics in `data.ts`.
- Projects: SublimeRead, Interactive Rails, Testoise, Ilamy Calendar, Collage Pen, Debackground (links in `data.ts`).
- Six blog posts in `src/content/blog/`.
- Education: Master's in Applied Computer Science, Dalhousie University.
- No testimonials, headshot, or client logos. Do not fabricate them, and do not invent uptime, traffic, or benchmark numbers.

## Product Principles

1. Evidence over adjectives: every claim points at shipped work, a number already in the data, or a post.
2. Backend first, full stack still true: lead with systems work without hiding the frontend history.
3. Honest status: in-progress things (AWS) read as in progress.
4. Fast to skim, deep on demand.

## Accessibility & Inclusion

WCAG 2.2 AA contrast and keyboard access; respect reduced motion.
