import { Popover } from "@base-ui/react/popover";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const content = document.querySelector(".prose");
    if (!content || headings.length === 0) return;

    const slugs = new Set(headings.map((h) => h.slug));
    const lastSlug = headings[headings.length - 1]?.slug ?? "";

    // Flat prose: an element's section heading is the nearest preceding sibling
    // that is a heading.
    const headingFor = (el: Element | null): HTMLElement | null => {
      let cur: Element | null = el;
      while (cur) {
        if (cur instanceof HTMLElement && cur.matches("h2[id], h3[id]")) {
          return cur;
        }
        cur = cur.previousElementSibling;
      }
      return null;
    };

    const atBottom = () =>
      Math.ceil(window.scrollY + window.innerHeight) >=
      document.documentElement.scrollHeight - 2;

    let observer: IntersectionObserver | undefined;
    const setup = () => {
      observer?.disconnect();
      const top = 100;
      const band = 64;
      const height = document.documentElement.clientHeight;
      const bottom = Math.max(0, height - top - band);
      observer = new IntersectionObserver(
        (entries) => {
          if (atBottom()) {
            setActiveSlug(lastSlug);
            return;
          }
          for (const { isIntersecting, target } of entries) {
            if (!isIntersecting) continue;
            const heading = headingFor(target);
            if (heading && slugs.has(heading.id)) {
              setActiveSlug(heading.id);
              break;
            }
          }
        },
        { rootMargin: `-${top}px 0% -${bottom}px` },
      );
      for (const el of content.children) observer.observe(el);
    };
    setup();

    const onScroll = () => {
      if (atBottom()) setActiveSlug(lastSlug);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let timeout: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(setup, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      clearTimeout(timeout);
    };
  }, [headings]);

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
