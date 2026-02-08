import { calculateYearsOfExperience } from "@/lib/utils";

export function AboutSection() {
  const yearsOfExperience = calculateYearsOfExperience(new Date("2019-02-01"));
  return (
    <section
      id="about"
      className="min-h-screen flex items-center px-8 py-20 bg-surface-1/50"
    >
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-start">
        <div className="space-y-12">
          <div className="flex items-center gap-4">
            <span className="font-mono text-sm text-primary/60">02.</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">
              About
            </h2>
          </div>

          <div className="space-y-8 text-foreground/85 leading-relaxed font-sans text-lg">
            <p>
              I am a{" "}
              <span className="text-primary font-medium">
                Senior Full-Stack Engineer
              </span>{" "}
              focused on technical excellence. My approach to software is rooted
              in architectural integrity and user-centric results.
            </p>

            <p>
              With over {yearsOfExperience} years of experience, I have led
              technical migrations, optimized performance-critical systems, and
              bridged the gap between complex business logic and intuitive
              frontend interfaces.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 pt-8 border-t border-border">
            <div>
              <h3 className="text-primary font-mono text-xs uppercase tracking-widest mb-4">
                Academic Root
              </h3>
              <p className="text-sm font-medium">
                Master's in Applied Computer Science
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Dalhousie University, Halifax
              </p>
            </div>
            <div>
              <h3 className="text-primary font-mono text-xs uppercase tracking-widest mb-4">
                Professional Focus
              </h3>
              <p className="text-sm font-medium">Full-Stack Architecture</p>
              <p className="text-xs text-muted-foreground mt-1">
                React, Ruby on Rails
              </p>
            </div>
          </div>
        </div>

        <div className="relative lg:pt-20">
          <div className="bg-surface-2 border border-border p-8 rounded-sm shadow-2xl">
            <h3 className="text-primary font-mono text-xs uppercase tracking-widest mb-8 text-center lg:text-left">
              Technical Arsenal
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                "TypeScript",
                "React.js",
                "Next.js",
                "Ruby on Rails",
                "PostgreSQL",
                "Node.js",
                "Astro.js",
                "Vue.js",
                "Tailwind CSS",
              ].map((skill) => (
                <div
                  key={skill}
                  className="bg-background/40 border border-border/50 py-3 px-2 text-center transition-all duration-300 hover:border-primary hover:bg-primary/5 group"
                >
                  <span className="text-xs font-mono group-hover:text-primary transition-colors">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Decorative element */}
          <div className="absolute -bottom-4 -right-4 size-32 bg-primary/5 -z-10" />
        </div>
      </div>
    </section>
  );
}
