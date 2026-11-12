import { Popover } from "@base-ui/react/popover";
import { useEffect, useState } from "react";
import { watchActiveHeading } from "../utils/active-heading";

type Heading = { depth: number; slug: string; text: string };

/**
 * Small-screen contents bar at the top of a post. The toggle opens a Base UI
 * Popover with the table of contents; Base UI owns open/close (trigger,
 * outside-click, Escape). The active section is tracked with the same
 * scroll-spy as the desktop list.
 */
export function MobileToc({ headings }: { headings: Heading[] }) {
  const [open, setOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState(headings[0]?.slug ?? "");

  useEffect(
    () =>
      watchActiveHeading(
        headings.map((h) => h.slug),
        setActiveSlug,
      ),
    [headings],
  );

  const activeText =
    headings.find((h) => h.slug === activeSlug)?.text ?? headings[0]?.text;

  return (
    <div className="mb-8 flex items-center justify-between gap-3 border-y border-border py-2 text-label post:hidden">
      <span className="shrink-0 text-muted-foreground">on this page</span>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          aria-label="Table of contents"
          className="inline-flex min-h-11 min-w-0 cursor-pointer items-center gap-2 text-foreground"
        >
          <span className="truncate">{activeText}</span>
          {open ? <CloseIcon /> : <MenuIcon />}
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner
            side="bottom"
            align="end"
            sideOffset={4}
            className="z-50"
          >
            <Popover.Popup className="max-h-popover w-72 max-w-popover overflow-y-auto border border-foreground bg-background p-3 font-mono text-label outline-none">
              <ul className="m-0 list-none border-l border-border p-0">
                {headings.map((h) => (
                  <li key={h.slug}>
                    <a
                      href={`#${h.slug}`}
                      onClick={() => setOpen(false)}
                      aria-current={h.slug === activeSlug ? "true" : undefined}
                      className={`toc-link -ml-px block border-l border-transparent py-2 leading-snug text-muted-foreground hover:text-foreground ${
                        h.depth === 3 ? "pl-6" : "pl-3"
                      }`}
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}
