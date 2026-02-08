import { Menu, Terminal, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SocialMediaLinks } from "./social-media-links";

const sections = ["home", "about", "experience", "projects", "contact"];

export function Header() {
  const [currentSection, setCurrentSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);

      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setCurrentSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Lock scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  const scrollToSection = (section: string) => {
    setCurrentSection(section);
    setIsMenuOpen(false);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Scroll Progress Indicator - Refined */}
      <div
        className="fixed top-0 left-0 h-px bg-primary transition-all duration-200 z-50 shadow-primary"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Translucent Header - Minimalist */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/60 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo/Brand - Left Side */}
          <div className="flex items-center gap-3">
            <div className="size-8 bg-primary/10 border border-primary/20 flex items-center justify-center rounded-sm">
              <Terminal className="size-4 text-primary" />
            </div>
            <span className="font-mono text-sm font-bold tracking-tighter text-foreground">
              SUJEET.KC
            </span>
          </div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden lg:flex items-center gap-10">
            {sections.map((section) => {
              const isActive = currentSection === section;
              return (
                <button
                  type="button"
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`font-mono text-xs uppercase tracking-ultrawide transition-all duration-300 hover:text-primary ${
                    isActive
                      ? "text-primary font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {section}
                </button>
              );
            })}
          </nav>

          {/* Right Side - Hamburger for Mobile */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <div
        className={`fixed inset-0 z-30 transition-all duration-500 lg:hidden ${
          isMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* Backdrop */}
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: Backdrop click */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: Backdrop click */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Drawer Content */}
        <nav
          className={`absolute right-0 top-0 h-full w-[80%] max-w-xs bg-surface-1 border-l border-border transition-transform duration-500 ease-in-out p-12 flex flex-col justify-center gap-8 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {sections.map((section, idx) => {
            const isActive = currentSection === section;
            return (
              <button
                type="button"
                key={section}
                onClick={() => scrollToSection(section)}
                className={`flex items-center gap-4 text-left transition-all duration-300 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                <span className="font-mono text-xs opacity-40">
                  0{idx + 1}.
                </span>
                <span
                  className={`font-mono text-sm uppercase tracking-megawide ${isActive ? "font-bold" : ""}`}
                >
                  {section}
                </span>
              </button>
            );
          })}

          <div className="mt-12 pt-12 border-t border-border/50">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6">
              Social Context
            </p>
            <div className="flex gap-4">
              <SocialMediaLinks />
            </div>
          </div>
        </nav>
      </div>

      {/* Social Media Links - Vertical Bar (Desktop Only) */}
      <div className="fixed left-8 bottom-0 z-40 hidden lg:flex flex-col items-center gap-6">
        <div className="flex flex-col gap-6 mb-8 transform -translate-y-4">
          <SocialMediaLinks />
        </div>
        <div className="w-px h-32 bg-border shadow-[0_0_10px_var(--border)]" />
      </div>
    </>
  );
}
