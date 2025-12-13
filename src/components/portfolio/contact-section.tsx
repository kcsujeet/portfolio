import { Coffee, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SocialMediaLinks } from "./social-media-links";

export function ContactSection() {
  return (
    <section id="contact" className="min-h-screen flex items-center px-8 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="font-mono text-sm text-emerald-400">05.</span>
          <h2 className="text-3xl md:text-4xl font-bold">Get In Touch</h2>
        </div>

        <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed">
          I'm always interested in new opportunities and exciting projects.
          Whether you have a question or just want to say hi, I'll try my best
          to get back to you!
        </p>

        <div className="flex flex-col gap-6 justify-center items-center">
          <a href="mailto:sujeetkc45@gmail.com">
            <div className="hover:scale-105 active:scale-95 transform transition-transform inline-block">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-8 py-3 rounded-none">
                <Mail className="w-4 h-4 mr-2" />
                Say Hello
              </Button>
            </div>
          </a>

          <div className="flex items-center gap-4 text-gray-300">
            <Coffee className="w-4 h-4" />
            <span className="font-mono text-sm">
              Always up for coffee chats
            </span>
          </div>
        </div>

        {/* Mobile Social Links */}
        <div className="flex mt-6 justify-center gap-6 mb-16 lg:hidden">
          <SocialMediaLinks />
        </div>
      </div>
    </section>
  );
}
