import { describe, expect, it } from "bun:test";
import { pickActiveHeading } from "./active-heading";

// Headings as a post lays them out: each with its top edge, in px from the
// top of the viewport. A jump to a heading lands its top at `landingLine`.
const landingLine = 192;

describe("pickActiveHeading", () => {
  it("picks the heading a click just scrolled to, even with the last paragraph of the section before still in view", () => {
    const headings = [
      { id: "everything-in-one-window", top: -700 },
      { id: "how-i-work-in-the-app", top: 192 },
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

  it("picks nothing for a post with no headings", () => {
    expect(pickActiveHeading([], landingLine, false)).toBeUndefined();
  });
});
