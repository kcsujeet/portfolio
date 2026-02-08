import { Terminal } from "lucide-react";
import { JOB_TITLE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-surface-1 border-t border-border">
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left - Branding */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-6 bg-primary/10 border border-primary/20 flex items-center justify-center rounded-sm">
                <Terminal className="size-3 text-primary" />
              </div>
              <span className="font-mono text-sm font-bold tracking-tighter">
                SKC.DEV
              </span>
            </div>
            <p className="text-muted-foreground text-sm font-sans max-w-xs leading-relaxed">
              {JOB_TITLE} specializing in high-performance web architectures and
              resilient systems.
            </p>
          </div>

          {/* Right - Meta Info */}
          <div className="flex flex-col md:items-end justify-between h-full">
            <div className="space-y-1 md:text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                © {new Date().getFullYear()} Sujeet Kc
              </p>
              <p className="font-serif italic text-sm text-foreground/60">
                Architected in Halifax, NS
              </p>
            </div>

            <div className="mt-8 md:mt-0">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
                v2.0.0 {/* Built with Astro */}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/30 flex justify-center">
          <div className="size-1 rounded-full bg-border" />
        </div>
      </div>
    </footer>
  );
}
