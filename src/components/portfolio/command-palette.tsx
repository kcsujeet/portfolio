import { Terminal } from "lucide-react";

const navigationItems = [
  {
    id: "home",
    label: "home",
    command: "cd ~/",
    description: "Back to home",
  },
  {
    id: "about",
    label: "about",
    command: "cat about.md",
    description: "Learn about me",
  },
  {
    id: "experience",
    label: "experience",
    command: "ls -la work/",
    description: "View work history",
  },
  {
    id: "projects",
    label: "projects",
    command: "git log --oneline",
    description: "Browse projects",
  },
  {
    id: "contact",
    label: "contact",
    command: "ping sujeet",
    description: "Get in touch",
  },
];

interface CommandPaletteProps {
  scrollToSection: (sectionId: string) => void;
  hideCommandPalette: () => void;
}

export function CommandPalette({
  scrollToSection,
  hideCommandPalette,
}: CommandPaletteProps) {
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Backdrop click handler
    // biome-ignore lint/a11y/noStaticElementInteractions: Backdrop click handler
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-32"
      onClick={hideCommandPalette}
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Stop propagation */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: Stop propagation */}
      <div
        className="bg-gray-800 border border-gray-600 rounded-lg w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-2 text-gray-300">
            <Terminal className="w-4 h-4" />
            <span className="font-mono text-sm">Command Palette</span>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded ml-auto">
              ESC to close
            </span>
          </div>
        </div>
        <div className="p-2">
          {navigationItems.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="w-full text-left p-3 rounded hover:bg-gray-700 transition-all group hover:translate-x-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-emerald-400">
                  $ {item.command}
                </span>
                <span className="text-xs text-gray-400 group-hover:text-gray-300">
                  {item.description}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
