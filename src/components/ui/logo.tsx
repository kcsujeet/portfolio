import { cn } from "@/lib/utils";

export type LogoVariant = "default";

interface LogoProps {
  className?: string;
  size?: number;
  variant?: LogoVariant;
}

export function Logo({ className, size = 32 }: LogoProps) {
  const commonProps = {
    width: size,
    height: size,
    viewBox: "0 0 100 100",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: cn(className),
    role: "img",
    "aria-labelledby": "logo-title",
  };

  return (
    <svg {...commonProps}>
      <title id="logo-title">SKC Morse Code Logo</title>
      {/* Background & Border */}
      <rect width="100" height="100" rx="22" fill="#0c0f0c" />
      <rect
        x="3"
        y="3"
        width="94"
        height="94"
        rx="19.5"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.5"
        opacity="0.35"
      />

      {/* S: ··· (Primary Color) */}
      <circle cx="20" cy="32" r="5" fill="var(--primary)" />
      <circle cx="34" cy="32" r="5" fill="var(--primary)" />
      <circle cx="48" cy="32" r="5" fill="var(--primary)" />

      {/* K: -·- (White/Neutral) */}
      <rect x="15" y="45" width="20" height="10" rx="5" fill="#ffffff" />
      <circle cx="44" cy="50" r="5" fill="#ffffff" />
      <rect x="53" y="45" width="20" height="10" rx="5" fill="#ffffff" />

      {/* C: -·-· (Primary Color) */}
      <rect x="15" y="63" width="20" height="10" rx="5" fill="var(--primary)" />
      <circle cx="44" cy="68" r="5" fill="var(--primary)" />
      <rect x="53" y="63" width="20" height="10" rx="5" fill="var(--primary)" />
      <circle cx="82" cy="68" r="5" fill="var(--primary)" />
    </svg>
  );
}
