type HeadingPosition = { id: string; top: number };

// Sub-pixel layout can leave a jumped-to heading a hair below its landing line.
const LANDING_TOLERANCE_PX = 4;

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
  const headings = ids
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);
  if (headings.length === 0) return () => {};

  let isPinned = false;
  let frame = 0;

  // Where the browser puts a heading it jumps to: the page's scroll-padding-top
  // plus the heading's own scroll-margin-top.
  const landingLine = () =>
    (Number.parseFloat(
      getComputedStyle(document.documentElement).scrollPaddingTop,
    ) || 0) +
    (Number.parseFloat(getComputedStyle(headings[0]).scrollMarginTop) || 0) +
    LANDING_TOLERANCE_PX;

  const isAtBottom = () =>
    Math.ceil(window.scrollY + window.innerHeight) >=
    document.documentElement.scrollHeight - 2;

  const update = () => {
    frame = 0;
    if (isPinned) return;
    const positions = headings.map((el) => ({
      id: el.id,
      top: el.getBoundingClientRect().top,
    }));
    const activeId = pickActiveHeading(positions, landingLine(), isAtBottom());
    if (activeId) onActive(activeId);
  };

  const scheduleUpdate = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  const pinTo = (id: string) => {
    if (!ids.includes(id)) return false;
    isPinned = true;
    onActive(id);
    return true;
  };

  const pinToHash = () => pinTo(decodeURIComponent(location.hash.slice(1)));

  const onClick = (event: MouseEvent) => {
    if (!(event.target instanceof Element)) return;
    const href = event.target.closest('a[href^="#"]')?.getAttribute("href");
    if (href) pinTo(decodeURIComponent(href.slice(1)));
  };

  // Any input that moves the page itself ends a jump's pin.
  const release = () => {
    if (!isPinned) return;
    isPinned = false;
    scheduleUpdate();
  };

  if (!pinToHash()) update();

  document.addEventListener("click", onClick);
  window.addEventListener("hashchange", pinToHash);
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  const releaseEvents = ["wheel", "touchstart", "keydown", "pointerdown"];
  for (const type of releaseEvents) {
    window.addEventListener(type, release, { passive: true });
  }

  return () => {
    cancelAnimationFrame(frame);
    document.removeEventListener("click", onClick);
    window.removeEventListener("hashchange", pinToHash);
    window.removeEventListener("scroll", scheduleUpdate);
    window.removeEventListener("resize", scheduleUpdate);
    for (const type of releaseEvents) {
      window.removeEventListener(type, release);
    }
  };
}
