import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-all",
  {
    variants: {
      variant: {
        default: "bg-[var(--badge)] text-[var(--badge-fg)] border-transparent",
        outline: "border-current/30 text-[var(--badge)] bg-transparent",
        soft: "bg-current/15 text-[var(--badge)] border-transparent",
      },
      color: {
        primary:
          "[--badge:var(--primary)] [--badge-fg:var(--primary-foreground)]",
        success:
          "[--badge:var(--success)] [--badge-fg:var(--success-foreground)]",
        info: "[--badge:var(--info)] [--badge-fg:var(--info-foreground)]",
        warning:
          "[--badge:var(--warning)] [--badge-fg:var(--warning-foreground)]",
        destructive:
          "[--badge:var(--destructive)] [--badge-fg:var(--destructive-foreground)]",
        secondary:
          "[--badge:var(--secondary)] [--badge-fg:var(--secondary-foreground)]",
      },
    },
    defaultVariants: {
      variant: "default",
      color: "primary",
    },
  },
);

function Badge({
  className,
  variant,
  color,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, color }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
