import { Terminal } from "lucide-react";
import { JOB_TITLE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-gray-700 bg-gray-800/30 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left - Branding */}
          <div>
            <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <span className="font-mono text-lg font-bold text-emerald-400">
                SKC
              </span>
            </div>
            <p className="text-sm text-gray-400 text-center md:text-left">
              {JOB_TITLE}
            </p>
          </div>

          {/* Center - Copyright */}
          <div className="text-center md:text-right">
            <p className="font-mono text-sm text-gray-400">
              © {new Date().getFullYear()} All rights reserved
            </p>
            <p className="font-mono text-xs text-gray-500 mt-1">
              Designed & Built by Sujeet Kc
            </p>
          </div>
        </div>

        {/* Bottom - Additional Info */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="font-mono text-xs text-gray-500">
            Built with Astro, TypeScript, and Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
