import { describe, expect, it } from "bun:test";
import {
  headingIdForFragment,
  isPlainLeftClick,
  pickActiveHeading,
} from "./active-heading";

// Headings as a post lays them out: each with its top edge, in px from the
// top of the viewport. A jump to a heading lands its top at `landingLine`.
const landingLine = 192;

describe("pickActiveHeading", () => {
  it("picks the heading a click just scrolled to, even with the last paragraph of the section before still in view", () => {
    const headings = [
      { id: "everything-in-one-window", top: -700 },
      { id: "how-i-work-in-the-app", top: landingLine },
      { id: "i-havent-uninstalled-vs-code-yet", top: 1196 },
    ];
    expect(pickActiveHeading(headings, landingLine, false)).toBe(
      "how-i-work-in-the-app",
    );
  });

  it("keeps the section above active until the next heading reaches the landing line", () => {
    const headings = [
      { id: "how-i-got-here", top: -300 },
      { id: "isnt-this-just-claude-code-in-a-window", top: 260 },
    ];
    expect(pickActiveHeading(headings, landingLine, false)).toBe(
      "how-i-got-here",
    );
  });

  it("picks the first heading while the reader is still above it", () => {
    const headings = [
      { id: "how-i-got-here", top: 874 },
      { id: "isnt-this-just-claude-code-in-a-window", top: 1424 },
    ];
    expect(pickActiveHeading(headings, landingLine, false)).toBe(
      "how-i-got-here",
    );
  });

  it("picks the last heading at the bottom of the page, when a short last section can't reach the landing line", () => {
    const headings = [
      { id: "i-havent-uninstalled-vs-code-yet", top: -120 },
      { id: "what-i-do-now", top: 420 },
    ];
    expect(pickActiveHeading(headings, landingLine, true)).toBe(
      "what-i-do-now",
    );
  });
});

describe("headingIdForFragment", () => {
  const ids = ["how-i-got-here", "café-tips"];

  it("finds the heading a fragment names as written", () => {
    expect(headingIdForFragment("how-i-got-here", ids)).toBe("how-i-got-here");
  });

  it("finds the heading a percent-encoded fragment names, as location.hash gives it", () => {
    expect(headingIdForFragment("caf%C3%A9-tips", ids)).toBe("café-tips");
  });

  it("matches nothing, without throwing, for a malformed fragment", () => {
    expect(headingIdForFragment("100%", ids)).toBeUndefined();
  });

  it("matches nothing for a fragment that isn't a heading, like a footnote", () => {
    expect(headingIdForFragment("fn1", ids)).toBeUndefined();
  });
});

describe("isPlainLeftClick", () => {
  const plainClick = {
    button: 0,
    defaultPrevented: false,
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
  };

  it("counts a plain left click, which jumps in this tab", () => {
    expect(isPlainLeftClick(plainClick)).toBe(true);
  });

  it("skips a cmd or ctrl click, which opens the link in a new tab instead", () => {
    expect(isPlainLeftClick({ ...plainClick, metaKey: true })).toBe(false);
    expect(isPlainLeftClick({ ...plainClick, ctrlKey: true })).toBe(false);
  });

  it("skips a click another handler cancelled", () => {
    expect(isPlainLeftClick({ ...plainClick, defaultPrevented: true })).toBe(
      false,
    );
  });

  it("skips a middle click", () => {
    expect(isPlainLeftClick({ ...plainClick, button: 1 })).toBe(false);
  });
});
