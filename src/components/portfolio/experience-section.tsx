import { Badge } from "@/components/ui/badge";
import { JOB_TITLE } from "@/lib/constants";

const experiences = [
  {
    period: "2023 — PRESENT",
    role: JOB_TITLE,
    company: "Event Temple",
    description:
      "Led migration from Angular.js to Next.js, boosted performance by 80%, secured 2000+ hotel customers.",
    tech: ["Next.js", "React", "Ruby on Rails", "Storybook"],
    highlight: "80% performance boost",
  },
  {
    period: "2021 — 2022",
    role: "Front-End Developer",
    company: "Legalfit",
    description:
      "Migrated Vue2 to Vue3, transitioned to TypeScript, reduced bugs by 50%.",
    tech: ["Vue3", "TypeScript", "Django"],
    highlight: "50% bug reduction",
  },
  {
    period: "2019 — 2021",
    role: "Software Engineer",
    company: "Tekvortex",
    description:
      "Built dependency mapping with D3.js, contributed to $500k annual profit.",
    tech: ["D3.js", "Angular", "Ruby on Rails", "PostgreSQL"],
    highlight: "$500k profit impact",
  },
];

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="min-h-screen flex items-center px-8 py-20"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-16">
          <span className="font-mono text-sm text-emerald-400">03.</span>
          <h2 className="text-3xl md:text-4xl font-bold">Experience</h2>
        </div>

        <div className="space-y-16">
          {experiences.map((exp) => (
            <div key={exp.company} className="group relative">
              <div className="grid lg:grid-cols-4 gap-8 items-start">
                <div className="lg:text-right">
                  <span className="font-mono text-sm text-emerald-400">
                    {exp.period}
                  </span>
                </div>

                <div className="lg:col-span-3">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {exp.role}
                      </h3>
                      <p className="text-gray-300">{exp.company}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-emerald-400 text-emerald-400 w-fit mt-2 lg:mt-0"
                    >
                      {exp.highlight}
                    </Badge>
                  </div>

                  <p className="text-gray-200 mb-4 leading-relaxed">
                    {exp.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {exp.tech.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-xs bg-gray-800 px-3 py-1 text-emerald-400 hover:scale-110 transform transition-transform"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
