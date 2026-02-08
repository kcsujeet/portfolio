import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const projects = [
  {
    name: "ilamy Calendar",
    description:
      "React-first, customizable, and feature-rich calendar library built for performance and developer experience.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Bun"],
    year: "2025",
    status: "Live",
    code: null,
    live: "https://ilamy.dev",
  },
  {
    name: "Collage Pen",
    description:
      "High-performance online collage maker with a native-like experience, utilizing modern Canvas API techniques.",
    tech: ["Astro", "React", "TypeScript", "Canvas API"],
    year: "2026",
    status: "Live",
    code: null,
    live: "https://collagepen.com",
  },
  {
    name: "Debackground",
    description:
      "Privacy-centric AI background removal tool using Transformers.js and WASM for local execution.",
    tech: ["Transformers.js", "WebAssembly", "TypeScript", "React"],
    year: "2026",
    status: "Live",
    live: "https://debackground.com",
    code: null,
  },
  {
    name: "Fujimee",
    description:
      "Fujifilm-inspired recipe platform architected with Astro, Cloudflare Functions, and Firebase.",
    tech: ["Astro", "Firebase", "Cloudflare", "Tailwind CSS"],
    year: "2025",
    status: "Live",
    live: "https://fujimee.com",
    code: null,
  },
  {
    name: "bdd-lazy-var-next",
    description:
      "Advanced lazy variable evaluation patterns for modern testing runners like Bun and Vitest.",
    tech: ["TypeScript", "Bun", "Vitest", "NPM"],
    year: "2025",
    status: "Open Source",
    code: "https://github.com/kcsujeet/bdd-lazy-var-next",
  },
];

export function ProjectsSection() {
  return (
    <section id="projects" className="min-h-screen py-32 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm text-primary/60">04.</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">
                Selected Works
              </h2>
            </div>
            <p className="text-muted-foreground font-sans max-w-xl text-lg">
              A curated selection of engineering projects, from open-source
              libraries to complex web architectures.
            </p>
          </div>
          <a
            href="https://github.com/kcsujeet"
            target="_blank"
            rel="noopener"
            className="group"
          >
            <Button
              variant="ghost"
              color="primary"
              size="lg"
              className="font-mono text-xs uppercase tracking-widest gap-4"
            >
              Repository Archive
              <ArrowUpRight className="size-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-1px bg-border border border-border overflow-hidden">
          {projects.map((project) => (
            <div
              key={project.name}
              className="group bg-background p-10 flex flex-col justify-between transition-colors hover:bg-surface-1"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-xs uppercase tracking-ultrawide text-muted-foreground">
                    {project.year}
                  </span>
                  <Badge
                    variant="soft"
                    color={project.status === "Live" ? "success" : "info"}
                    className="font-mono text-xs uppercase tracking-wider"
                  >
                    {project.status}
                  </Badge>
                </div>

                <h3 className="text-2xl font-serif font-bold mb-4 group-hover:text-primary transition-colors">
                  {project.name}
                </h3>

                <p className="text-muted-foreground mb-8 leading-relaxed font-sans text-base line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-10">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-xs uppercase tracking-wider px-2 py-1 bg-surface-2 text-foreground/70 border border-border/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                {project.live && (
                  <Button
                    variant="outline"
                    color="primary"
                    size="sm"
                    asChild
                    className="h-8 text-xs uppercase tracking-widest font-mono font-bold"
                  >
                    <a href={project.live} target="_blank" rel="noopener">
                      Preview <ExternalLink className="size-3 ml-2" />
                    </a>
                  </Button>
                )}
                {project.code && (
                  <Button
                    variant="ghost"
                    color="primary"
                    size="sm"
                    asChild
                    className="h-8 text-xs uppercase tracking-widest font-mono font-bold"
                  >
                    <a href={project.code} target="_blank" rel="noopener">
                      Source <Github className="size-3 ml-2" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
          {/* View All Card */}
          <div className="bg-surface-2 p-10 flex flex-col items-center justify-center text-center space-y-6">
            <h4 className="font-serif text-xl text-muted-foreground">
              Exploring more?
            </h4>
            <Button
              variant="soft"
              color="primary"
              asChild
              className="font-mono text-xs uppercase tracking-megawide font-bold"
            >
              <a
                href="https://github.com/kcsujeet"
                target="_blank"
                rel="noopener"
              >
                Full Project Index
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
