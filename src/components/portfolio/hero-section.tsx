import { Briefcase, MapPin } from "lucide-react";
import { JOB_TITLE, NAME } from "@/lib/constants";
import { calculateYearsOfExperience } from "@/lib/utils";

export function HeroSection() {
  const yearsOfExperience = calculateYearsOfExperience(new Date("2019-02-01"));
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative p-8 pt-20"
    >
      {/* Structural background - Minimalist Grid */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="mb-12">
          <p className="font-mono text-sm text-primary mb-4 tracking-widest uppercase">
            Engineering Excellence
          </p>
          <h1 className="text-7xl md:text-9xl font-serif font-bold leading-[0.9] tracking-tight text-foreground">
            {NAME.split(" ")[0]}
            <span className="block text-primary/80 ml-8 md:ml-16 mt-4">
              {NAME.split(" ")[1]}
            </span>
          </h1>
        </div>

        <div className="max-w-2xl">
          <p className="text-xl text-foreground/80 mb-10 leading-relaxed font-sans font-light">
            <span className="font-semibold uppercase tracking-tighter mr-2">
              {JOB_TITLE}
            </span>
            specializing in building robust and efficient applications with{" "}
            {yearsOfExperience}+ years of experience.
          </p>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-xs text-muted-foreground font-mono uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Briefcase className="size-3 text-primary/80" />
              <span className="font-mono text-xs uppercase tracking-widest text-primary/80">
                Open to Opportunities
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-3 text-primary/80" />
              <span className="text-primary/80">Remote / Hybrid</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
