import { Terminal } from "lucide-react";
import { useEffect, useState } from "react";
import { CommandPalette } from "./command-palette";
import { SocialMediaLinks } from "./social-media-links";

const sections = ["home", "about", "experience", "projects", "contact"];

export function Header() {
  const [currentSection, setCurrentSection] = useState("home");
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);

      // Update current section
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

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowCommandPalette(!showCommandPalette);
      }
      if (e.key === "Escape") {
        setShowCommandPalette(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showCommandPalette]);

  const scrollToSection = (section: string) => {
    setCurrentSection(section);
    setShowCommandPalette(false);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Scroll Progress Indicator */}
      <div
        className="fixed top-0 left-0 h-0.5 bg-gradient-to-r from-emerald-400 to-blue-400 transition-all duration-200 z-50"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Translucent Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo/Brand - Left Side */}
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <span className="font-mono text-lg font-bold text-white">
              sujeet.kc
            </span>
          </div>

          {/* Desktop Navigation - Center (Hidden on mobile) */}
          <nav className="hidden lg:flex items-center gap-8">
            {sections.map((section) => {
              const isActive = currentSection === section;
              return (
                <button
                  type="button"
                  key={section}
                  onClick={() => {
                    scrollToSection(section);
                  }}
                  className={`font-mono text-sm transition-all duration-300 hover:scale-105 hover:text-emerald-400 ${
                    isActive
                      ? "text-emerald-400 font-semibold"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  /{section}
                </button>
              );
            })}
          </nav>

          {/* Right Side - Command Palette Trigger (Mobile) & Current Section (Mobile) */}
          <div className="flex items-center gap-3">
            {/* Current Section Indicator - Mobile Only */}
            <div className="lg:hidden bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-lg px-3 py-2">
              <span className="font-mono text-sm text-emerald-400">
                /{currentSection}
              </span>
            </div>

            {/* Command Palette Trigger - Mobile Only */}
            <button
              type="button"
              onClick={() => setShowCommandPalette(true)}
              className="lg:hidden bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-lg px-3 py-2 text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 hover:border-emerald-400"
              aria-label="Open command palette"
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <span className="font-mono text-sm hidden sm:inline">⌘K</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Command Palette */}
      {showCommandPalette && (
        <CommandPalette
          scrollToSection={scrollToSection}
          hideCommandPalette={() => setShowCommandPalette(false)}
        />
      )}

      {/* Social Media Links - Floating */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-4">
        <SocialMediaLinks />
        <div className="w-px h-16 bg-gray-600 mx-auto mt-4" />
      </div>
    </>
  );
}
