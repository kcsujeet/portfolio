import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { JOB_TITLE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-6xl mx-auto px-8 py-20">
        <div className="grid md:grid-cols-2 gap-20 items-end">
          {/* Left - Identity */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Logo size={56} />
              <span className="font-mono text-sm font-bold tracking-tighter">
                SUJEET.KC
              </span>
            </div>
            <p className="text-muted-foreground text-sm font-sans max-w-sm leading-relaxed">
              {JOB_TITLE} focused on creating scalable, high-performance
              applications with modern web technologies.
            </p>
          </div>

          {/* Right - Meta */}
          <div className="flex flex-col md:items-end space-y-4">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Built with Astro.JS
            </p>
            <p className="font-mono text-xs uppercase tracking-longwide text-muted-foreground">
              © {new Date().getFullYear()} Sujeet Kc
            </p>
            <div>
              <Badge
                variant="soft"
                color="primary"
                className="font-mono rounded-2xl text-xs bg-primary/20 text-primary/80"
              >
                v2.0.0
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
