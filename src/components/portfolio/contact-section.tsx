import { Mail } from "lucide-react";
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
                Direct Access
              </h2>
            </div>
            <p className="text-muted-foreground font-sans text-xl max-w-2xl mx-auto leading-relaxed">
              Always interested in unique technical challenges and high-impact
              collaborations. Feel free to reach out if you're building
              something that requires a thoughtful full-stack perspective.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 w-full max-w-2xl text-left">
            <a href="mailto:sujeetkc45@gmail.com" className="group h-full">
              <div className="h-full p-8 border border-border bg-background hover:border-primary transition-all duration-300 rounded-sm flex flex-col gap-6">
                <div className="size-12 bg-primary/5 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                  <Mail className="size-5" />
                </div>
                <div className="space-y-4">
                  <h3 className="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                    Email Communication
                  </h3>
                  <p className="text-lg font-medium tracking-tight border-b border-primary/10 group-hover:border-primary transition-all inline-block">
                    sujeetkc45@gmail.com
                  </p>
                </div>
              </div>
            </a>

            <div className="p-8 border border-border bg-background rounded-sm flex flex-col gap-6">
              <div className="size-12 bg-surface-2 rounded-full flex items-center justify-center">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
              </div>
              <div className="space-y-4">
                <h3 className="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                  Inquiry Status
                </h3>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Selective Engagement</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Listening for opportunities. Expect a response within 24-48
                    business hours.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8 pt-12">
            <div className="w-px h-16 bg-gradient-to-b from-border to-transparent" />
            <div className="flex justify-center gap-8 lg:hidden">
              <SocialMediaLinks />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
