import { Github, Globe, Linkedin, Mail } from "lucide-react";

const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/kcsujeet",
    icon: Github,
    color: "text-gray-300 hover:text-emerald-400",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/kc-sujeet",
    icon: Linkedin,
    color: "text-gray-300 hover:text-emerald-400",
  },
  {
    name: "Email",
    url: "mailto:sujeetkc45@gmail.com",
    icon: Mail,
    color: "text-gray-300 hover:text-emerald-400",
  },
  {
    name: "Dev.to",
    url: "https://dev.to/kcsujeet",
    icon: Globe,
    color: "text-gray-300 hover:text-emerald-400",
  },
];

export function SocialMediaLinks() {
  return socialLinks.map((social) => (
    <div key={social.name}>
      <a
        href={social.url}
        target={social.name !== "Email" ? "_blank" : undefined}
        rel={social.name !== "Email" ? "noopener noreferrer" : undefined}
        className={`block p-3 bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-lg transition-all duration-300 hover:scale-110 hover:bg-gray-700/80 hover:border-emerald-400 ${social.color}`}
        title={social.name}
        aria-label={social.name}
      >
        <social.icon className="w-5 h-5" />
      </a>
    </div>
  ));
}
