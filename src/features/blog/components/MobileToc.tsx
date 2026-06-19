import { Popover } from "@base-ui/react/popover";
import { useEffect, useState } from "react";

type Heading = { depth: number; slug: string; text: string };

/**
 * Mobile top bar: pinned to the very top edge of the screen with the "back to
 * all writing" link on the left and a hamburger on the right. The hamburger
 * opens a Base UI Popover with the table of contents. Base UI owns open/close
 * (trigger toggle, outside-click, Escape), so the toggle is reliable. The active
 * section is tracked with the same scroll-spy as the desktop rail.
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

  return (
    <div className="lg:hidden fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-3 border-b border-border bg-background/5 px-6 py-3 backdrop-blur-md">
      <a
        href="/blog"
        className="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
      >
        <span className="transition-transform group-hover:-translate-x-1">
          ←
        </span>
        <span className="font-mono text-xs uppercase tracking-widest">
          All Writing
        </span>
      </a>

      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          aria-label="Table of contents"
          className="inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:text-primary data-[popup-open]:text-primary"
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner
            side="bottom"
            align="end"
            sideOffset={8}
            className="z-50"
          >
            <Popover.Popup className="max-h-[70vh] w-64 max-w-[80vw] overflow-y-auto rounded-lg border border-border bg-background/95 p-3 shadow-lg backdrop-blur outline-none">
              <p className="mb-2 px-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                On this page
              </p>
              <ul className="border-l border-border">
                {headings.map((h) => (
                  <li key={h.slug}>
                    <a
                      href={`#${h.slug}`}
                      onClick={() => setOpen(false)}
                      aria-current={h.slug === activeSlug ? "true" : undefined}
                      className={`toc-link block -ml-px border-l border-transparent py-1.5 text-sm leading-snug text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary ${
                        h.depth === 3 ? "pl-7" : "pl-4"
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
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
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
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}
