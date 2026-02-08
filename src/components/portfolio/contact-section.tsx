import { Activity, Mail } from "lucide-react";
import { SocialMediaLinks } from "./social-media-links";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="min-h-screen flex items-center px-8 py-32 bg-surface-1/30"
    >
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex flex-col items-center text-center space-y-12">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <span className="font-mono text-sm text-primary/60">05.</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">
                Contact
              </h2>
            </div>
            <p className="text-muted-foreground font-sans text-xl max-w-2xl mx-auto leading-relaxed">
              Always interested in complex problems and high-impact
              collaborations. Feel free to reach out if you're building
              something that requires a thoughtful full-stack perspective.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 w-full max-w-2xl text-left">
            <a href="mailto:sujeetkc45@gmail.com" className="group h-full">
              <div className="h-full p-8 border border-border bg-background hover:border-primary/50 hover:bg-surface-1/50 transition-all duration-300 rounded-sm flex flex-col gap-6">
                <div className="size-12 bg-primary/5 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                  <Mail className="size-5" />
                </div>
                <div className="space-y-4">
                  <h3 className="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                    Email Communication
                  </h3>
                  <p className="text-lg font-medium tracking-tight border-b border-primary/10 transition-all inline-block text-muted-foreground group-hover:decoration-primary underline">
                    sujeetkc45@gmail.com
                  </p>
                </div>
              </div>
            </a>

            <div className="group p-8 border border-border bg-background hover:border-primary/50 hover:bg-surface-1/50 transition-all duration-300 rounded-sm flex flex-col gap-6">
              <div className="size-12 bg-primary/5 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                <Activity className="size-5" />
              </div>
              <div className="space-y-4">
                <h3 className="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                  Inquiry Status
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Listening for opportunities. Expect a response within 24-48
                    business hours.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8 pt-12">
            <div className="w-px h-16 bg-linear-to-b from-border to-transparent" />
            <div className="flex justify-center gap-8 lg:hidden">
              <SocialMediaLinks />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
