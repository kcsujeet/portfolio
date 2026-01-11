import { ArrowUpRight, Code2, ExternalLink, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const projects = [
  {
    name: "ilamy Calendar",
    description:
      "React-first, customizable, and feature-rich calendar library.",
    tech: [
      "React",
      "Shadcn",
      "Tailwind CSS",
      "TypeScript",
      "Framer Motion",
      "Bun",
    ],
    year: "Jul, 2025",
    status: "Live",
    code: null,
    live: "https://ilamy.dev",
  },
  {
    name: "Collage Pen",
    description:
      "A free online collage maker with native like experience",
    tech: ["Astro", "React", "TypeScript", "Canvas API", "Shadcn", "Tailwind CSS"],
    year: "Jan, 2026",
    status: "Live",
    code: null,
    live: "https://collagepen.com",
  },
  {
    name: "Debackground",
    description:
      "Free AI-powered background removal tool that runs locally in browser, ensuring privacy and high-quality results.",
    tech: [
      "React",
      "Tailwind CSS",
      "Transformers.js",
      "WebAssembly",
      "TypeScript",
    ],
    year: "Jan, 2026",
    status: "Live",
    live: "https://debackground.com",
    code: null
  }
  {
    name: "Fujimee",
    description:
      "Fujifilm inspired recipes for photos built with Astro, Firebase, Cloudflare Functions, and Tailwind CSS.",
    tech: [
      "Astro",
      "Firebase",
      "Cloudflare Functions",
      "Tailwind CSS",
      "TypeScript",
    ],
    year: "Dec, 2025",
    status: "Live",
    live: "https://fujimee.com",
    code: null,
  },

  {
    name: "bdd-lazy-var-next",
    description: "Lazy variable evaluation helpers for Bun, Vitest, and Jest.",
    tech: ["TypeScript", "Bun", "Vitest", "Jest", "NPM"],
    year: "Sep, 2025",
    status: "Open Source",
    code: "https://github.com/kcsujeet/bdd-lazy-var-next",
  },
  {
    name: "Passport Photo Wiz",
    description:
      "Web app for creating compliant passport photos with background removal",
    tech: ["React", "TypeScript", "Canvas API"],
    year: "Apr, 2025",
    status: "Live",
    code: null,
    live: "https://passportphotowiz.com",
  },
  {
    name: "Sl Vue Tree Next",
    description: "Vue 3 compatible tree component library published to npm",
    tech: ["Vue3", "TypeScript", "NPM"],
    year: "Feb, 2024",
    status: "Open Source",
    code: "https://github.com/kcsujeet/sl-vue-tree-next",
    live: null,
  },
];

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="min-h-screen flex items-center px-8 py-20"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-16">
          <span className="font-mono text-sm text-emerald-400">04.</span>
          <h2 className="text-3xl md:text-4xl font-bold">Projects</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project.name}
              className="group bg-gray-800/50 border border-gray-700 p-8 hover:border-emerald-400 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-emerald-400" />
                  <span className="font-mono text-sm text-gray-300">
                    {project.year}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="border-blue-400 text-blue-400"
                >
                  {project.status}
                </Badge>
              </div>

              <h3 className="text-xl font-semibold mb-3 group-hover:text-emerald-400 transition-colors">
                {project.name}
              </h3>

              <p className="text-gray-200 mb-6 leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-xs bg-gray-900 px-3 py-1 text-emerald-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                {project.code && (
                  <div className="hover:scale-105 transform transition-transform">
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-black font-semibold p-0 bg-transparent"
                    >
                      <a
                        href={project.code}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="w-4 h-4 mr-2" />
                        Code
                      </a>
                    </Button>
                  </div>
                )}
                {project.live && (
                  <div className="hover:scale-105 transform transition-transform">
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-black font-semibold p-0 bg-transparent"
                    >
                      <a href={project.live} target="_blank">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <a href="https://github.com/kcsujeet" target="_blank" rel="noopener">
            <div className="hover:scale-105 active:scale-95 transform transition-transform inline-block">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-8 py-3 rounded-none">
                View All Projects
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
