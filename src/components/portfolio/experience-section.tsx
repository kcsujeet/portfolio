import { Badge } from "@/components/ui/badge";
import { JOB_TITLE } from "@/lib/constants";

const experiences = [
  {
    period: "2023 — PRESENT",
    role: JOB_TITLE,
    company: "Event Temple",
    description:
      "Architected the migration from legacy Angular.js to a modern Next.js stack, achieving an 80% performance gain. Leading technical strategy for a platform serving over 2,000 global hotel customers.",
    tech: ["Next.js", "React", "Ruby on Rails", "Storybook"],
    highlight: "80% Performance Boost",
  },
  {
    period: "2021 — 2022",
    role: "Front-End Developer",
    company: "Legalfit",
    description:
      "Led the transition from Vue 2 to Vue 3 with a full Type-Safe implementation. Standardized UI components and reduced production bug reports by 50%.",
    tech: ["Vue 3", "TypeScript", "Django"],
    highlight: "50% Reliability Increase",
  },
  {
    period: "2019 — 2021",
    role: "Software Engineer",
    company: "Tekvortex",
    description:
      "Developed high-complexity dependency mapping visualizations using D3.js. Contributed to core features that drove $500k in annual profit growth.",
    tech: ["D3.js", "Ruby on Rails", "PostgreSQL"],
    highlight: "$500k ARR Contribution",
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="min-h-screen py-32 px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-24">
          <span className="font-mono text-sm text-primary/60">03.</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">
            Professional Journey
          </h2>
        </div>

        <div className="space-y-24">
          {experiences.map((exp) => (
            <div
              key={exp.company}
              className="group flex flex-col md:flex-row gap-8 md:gap-20"
            >
              <div className="md:w-1/4 pt-1">
                <span className="font-mono text-xs uppercase tracking-megawide text-muted-foreground group-hover:text-primary transition-colors">
                  {exp.period}
                </span>
              </div>

              <div className="md:w-3/4 space-y-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-serif font-bold text-foreground">
                      {exp.role}
                    </h3>
                    <p className="text-primary font-sans text-lg font-medium italic">
                      {exp.company}
                    </p>
                  </div>
                  <Badge
                    variant="soft"
                    color="primary"
                    className="font-mono text-xs uppercase tracking-wider py-1 px-3"
                  >
                    {exp.highlight}
                  </Badge>
                </div>

                <p className="text-muted-foreground text-lg leading-relaxed font-sans max-w-3xl">
                  {exp.description}
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  {exp.tech.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-xs uppercase tracking-widest text-foreground/60 border border-border px-3 py-1 bg-surface-1"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
