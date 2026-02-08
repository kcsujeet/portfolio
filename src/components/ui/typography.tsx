import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "text-7xl md:text-9xl font-bold leading-[0.9] tracking-tight",
      h2: "text-4xl md:text-5xl font-bold tracking-tight",
      h3: "text-2xl font-bold",
      h4: "text-xl font-bold",
      body1: "text-lg md:text-xl leading-relaxed",
      body2: "text-base leading-relaxed",
      caption: "text-xs",
      overline: "text-xs uppercase tracking-widest",
    },
    font: {
      sans: "font-sans",
      serif: "font-serif",
      mono: "font-mono",
    },
    color: {
      initial: "",
      foreground: "text-foreground",
      primary: "text-primary",
      secondary: "text-secondary",
      muted: "text-muted-foreground",
      success: "text-success",
      info: "text-info",
      warning: "text-warning",
      destructive: "text-destructive",
    },
    gutterBottom: {
      true: "mb-4",
      false: "",
    },
    italic: {
      true: "italic",
      false: "",
    },
  },
  defaultVariants: {
    variant: "body2",
    font: "sans", // Default font if not specified or derived
    color: "foreground",
    gutterBottom: false,
    italic: false,
  },
});

export interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof typographyVariants> {
  asChild?: boolean;
  component?: React.ElementType;
}

const variantFontMap: Record<string, "sans" | "serif" | "mono"> = {
  h1: "serif",
  h2: "serif",
  h3: "serif",
  h4: "serif",
  body1: "sans",
  body2: "sans",
  overline: "mono",
  caption: "sans",
};

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  (
    {
      className,
      variant = "body2",
      font,
      color,
      gutterBottom,
      italic,
      asChild = false,
      component,
      ...props
    },
    ref,
  ) => {
    const defaultComponent = variant?.startsWith("h")
      ? (variant as React.ElementType)
      : variant === "overline" || variant === "caption"
        ? "span"
        : "p";

    const Comp = asChild ? Slot : component || defaultComponent;

    // Apply smart font defaults if not explicitly provided
    const finalFont = font || (variant ? variantFontMap[variant] : "sans");

    return (
      <Comp
        className={cn(
          typographyVariants({
            variant,
            font: finalFont,
            color,
            gutterBottom,
            italic,
            className,
          }),
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Typography.displayName = "Typography";

export { Typography, typographyVariants };
