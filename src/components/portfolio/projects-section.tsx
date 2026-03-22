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
    status: ["Live", "Open Source"],
    github: "https://github.com/kcsujeet/calendar",
    live: "https://ilamy.dev",
  },
  {
    name: "testoise",
    description:
      "Lightweight and fully type-safe lazy test variables for Bun, Vitest, Jest, and Node.js. Inspired by RSpec.",
    tech: ["TypeScript", "Bun", "Vitest", "Jest", "Node.js"],
    year: "2026",
    status: ["Open Source"],
    github: "https://github.com/kcsujeet/testoise",
  },
  {
    name: "Collage Pen",
    description:
      "High-performance online collage maker with a native-like experience, utilizing modern Canvas API techniques.",
    tech: ["Astro", "React", "TypeScript", "Canvas API"],
    year: "2026",
    status: ["Live"],
    github: null,
    live: "https://collagepen.com",
  },
  {
    name: "Debackground",
    description:
      "Privacy-centric AI background removal tool using Transformers.js and WASM for local execution.",
    tech: ["Transformers.js", "WebAssembly", "TypeScript", "React"],
    year: "2026",
    status: ["Live"],
    github: null,
    live: "https://debackground.com",
  },
  {
    name: "Fujimee",
    description:
      "Fujifilm-inspired recipe platform architected with Astro, Cloudflare Functions, and Firebase.",
    tech: ["Astro", "Firebase", "Cloudflare", "Tailwind CSS"],
    year: "2025",
    status: ["Live"],
    github: null,
    live: "https://fujimee.com",
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-10">
          {projects.map((project) => (
            <div
              key={project.name}
              className="group relative flex flex-col justify-between p-8 md:p-10 rounded-sm bg-background border border-border transition-all duration-300 hover:bg-surface-1/50 hover:border-primary/50 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-xs uppercase tracking-ultrawide text-muted-foreground">
                    {project.year}
                  </span>
                  <div className="flex gap-2">
                    {project.status.map((status) => (
                      <Badge
                        key={status}
                        variant="soft"
                        color={status === "Live" ? "success" : "info"}
                        className="font-mono text-xs uppercase tracking-wider"
                      >
                        {status}
                      </Badge>
                    ))}
                  </div>
                </div>

                <h3 className="text-2xl font-serif font-bold mb-4 group-hover:text-primary transition-colors">
                  {project.name}
                </h3>

                <p className="text-muted-foreground mb-8 leading-relaxed font-sans text-base line-clamp-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-10">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 bg-surface-1 text-foreground/60 border border-border"
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
                {project.github && (
                  <Button
                    variant="outline"
                    color="primary"
                    size="sm"
                    asChild
                    className="h-8 text-xs uppercase tracking-widest font-mono font-bold"
                  >
                    <a href={project.github} target="_blank" rel="noopener">
                      GitHub <Github className="size-3 ml-2" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}

          {/* View All Card */}
          <div className="group relative flex flex-col items-center justify-center text-center p-8 md:p-10 rounded-sm bg-surface-2/30 border border-border transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 space-y-6">
            <h4 className="font-serif text-2xl text-muted-foreground group-hover:text-foreground transition-colors">
              Exploring more?
            </h4>
            <p className="text-muted-foreground font-sans max-w-[200px] text-sm mb-4">
              Dive into the full repository archive on GitHub.
            </p>
            <Button
              variant="soft"
              color="primary"
              asChild
              className="font-mono text-xs uppercase tracking-megawide font-bold px-8 shadow-sm hover:shadow-primary/20"
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
