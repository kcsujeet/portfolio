type HeadingPosition = { id: string; top: number };

// Sub-pixel layout can leave a jumped-to heading a hair below its landing line.
const LANDING_TOLERANCE_PX = 4;
// Rounding can leave the page a pixel or two short of its full scroll height.
const BOTTOM_TOLERANCE_PX = 2;

/**
 * The section a reader is in: the last heading whose top has reached the line
 * a jump to a heading scrolls it to, or the last heading once the page is
 * scrolled to the bottom (a short last section can't reach the line). Before
 * the first heading, the first one.
 */
export function pickActiveHeading(
  headings: HeadingPosition[],
  landingLine: number,
  isAtBottom: boolean,
): string | undefined {
  if (isAtBottom) return headings.at(-1)?.id;
  const reached = headings.filter((h) => h.top <= landingLine);
  return (reached.at(-1) ?? headings[0])?.id;
}

/**
 * The heading id a URL fragment (the part after `#`) points at, written as-is
 * or percent-encoded. Never decodes, so a malformed fragment like `100%`
 * matches nothing instead of throwing.
 */
export function headingIdForFragment(
  fragment: string,
  ids: string[],
): string | undefined {
  return ids.find(
    (id) => id === fragment || encodeURIComponent(id) === fragment,
  );
}

const parsePx = (value: string) => Number.parseFloat(value) || 0;

type ClickInput = Pick<
  MouseEvent,
  "button" | "defaultPrevented" | "metaKey" | "ctrlKey" | "shiftKey" | "altKey"
>;

/**
 * Whether a click on a `#` link makes the browser jump in this tab: a plain
 * left click, not a modified one (new tab or window) and not one another
 * handler already cancelled.
 */
export function isPlainLeftClick(event: ClickInput): boolean {
  const hasModifier =
    event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  return event.button === 0 && !event.defaultPrevented && !hasModifier;
}

/**
 * Reports the active section of a post as the reader scrolls, for its tables of
 * contents. A heading the reader jumps to (a contents link, an anchor, a #hash
 * on load, back and forward) stays active until they scroll on their own, since
 * a jump near the end of the page can't bring the heading all the way up.
 * Returns a function that stops watching.
 */
export function watchActiveHeading(
  ids: string[],
  onActive: (id: string) => void,
): () => void {
  const headingElements = ids
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);
  if (headingElements.length === 0) return () => {};

  let isPinned = false;
  let pendingFrameId = 0;

  // Where the browser puts a heading it jumps to: the page's scroll-padding-top
  // plus the heading's own scroll-margin-top.
  const getLandingLine = () => {
    const scrollPadding = parsePx(
      getComputedStyle(document.documentElement).scrollPaddingTop,
    );
    const scrollMargin = parsePx(
      getComputedStyle(headingElements[0]).scrollMarginTop,
    );
    return scrollPadding + scrollMargin + LANDING_TOLERANCE_PX;
  };

  const isAtBottom = () =>
    Math.ceil(window.scrollY + window.innerHeight) >=
    document.documentElement.scrollHeight - BOTTOM_TOLERANCE_PX;

  const updateActiveHeading = () => {
    pendingFrameId = 0;
    if (isPinned) return;
    const positions = headingElements.map((el) => ({
      id: el.id,
      top: el.getBoundingClientRect().top,
    }));
    const landingLine = getLandingLine();
    const atBottom = isAtBottom();
    const activeId = pickActiveHeading(positions, landingLine, atBottom);
    if (activeId) onActive(activeId);
  };

  const scheduleUpdate = () => {
    if (!pendingFrameId) {
      pendingFrameId = requestAnimationFrame(updateActiveHeading);
    }
  };

  const pinToFragment = (fragment: string) => {
    const id = headingIdForFragment(fragment, ids);
    if (!id) return false;
    isPinned = true;
    onActive(id);
    return true;
  };

  // Any input that moves the page itself ends a jump's pin.
  const releasePin = () => {
    if (!isPinned) return;
    isPinned = false;
    scheduleUpdate();
  };

  const handleHashLinkClick = (event: MouseEvent) => {
    if (!isPlainLeftClick(event)) return;
    if (!(event.target instanceof Element)) return;
    const href = event.target.closest('a[href^="#"]')?.getAttribute("href");
    if (href) pinToFragment(href.slice(1));
  };

  // Back and forward to an entry that isn't a heading (no hash, a footnote)
  // hands the highlight back to the scroll position.
  const handleHashChange = () => {
    if (!pinToFragment(location.hash.slice(1))) releasePin();
  };

  if (!pinToFragment(location.hash.slice(1))) updateActiveHeading();

  document.addEventListener("click", handleHashLinkClick);
  window.addEventListener("hashchange", handleHashChange);
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  const releaseEvents = ["wheel", "touchstart", "keydown", "pointerdown"];
  for (const type of releaseEvents) {
    window.addEventListener(type, releasePin, { passive: true });
  }

  return () => {
    cancelAnimationFrame(pendingFrameId);
    document.removeEventListener("click", handleHashLinkClick);
    window.removeEventListener("hashchange", handleHashChange);
    window.removeEventListener("scroll", scheduleUpdate);
    window.removeEventListener("resize", scheduleUpdate);
    for (const type of releaseEvents) {
      window.removeEventListener(type, releasePin);
    }
  };
}
