import { Github, Globe, Linkedin, Mail } from "lucide-react";

const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/kcsujeet",
    icon: Github,
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/kc-sujeet",
    icon: Linkedin,
  },
  {
    name: "Email",
    url: "mailto:sujeetkc45@gmail.com",
    icon: Mail,
  },
  {
    name: "Dev.to",
    url: "https://dev.to/kcsujeet",
    icon: Globe,
  },
];

export function SocialMediaLinks() {
  return socialLinks.map((social) => (
    <div key={social.name}>
      <a
        href={social.url}
        target={social.name !== "Email" ? "_blank" : undefined}
        rel={social.name !== "Email" ? "noopener noreferrer" : undefined}
        className="group block p-2 border border-border/50 bg-background/50 backdrop-blur-sm rounded-sm transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:-translate-y-1"
        title={social.name}
        aria-label={social.name}
      >
        <social.icon className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </a>
    </div>
  ));
}
