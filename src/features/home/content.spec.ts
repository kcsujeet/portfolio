import { describe, expect, it } from "bun:test";
import { EXPERIENCE, PROJECTS, STACK } from "./data";

describe("Portfolio Content - Backend & Cloud Focus", () => {
  describe("Core Stack", () => {
    it("includes key backend and cloud technologies", () => {
      expect(STACK).toContain("Node.js");
      expect(STACK).toContain("Ruby on Rails");
      expect(STACK).toContain("PostgreSQL");
      expect(STACK).toContain("AWS");
      expect(STACK).toContain("REST & JSON:API");
    });
  });

  describe("Experience Section", () => {
    it("contains only authentic workplace employment history", () => {
      const ids = EXPERIENCE.map((e) => e.id);
      expect(ids).toEqual(["et", "lf", "tv"]);
      // Ensure AWS is not listed as an employer/company in EXPERIENCE
      expect(EXPERIENCE.find((e) => e.id === "aws")).toBeUndefined();
    });

    it("contains Event Temple with Rails and PostgreSQL backend work without Node.js", () => {
      const et = EXPERIENCE.find((e) => e.id === "et");
      expect(et).toBeDefined();
      expect(et?.company).toBe("Event Temple");
      expect(et?.summary).toContain("Rails API");
      expect(et?.summary).toContain("JSON:API");
      expect(et?.stack).toContain("Ruby on Rails");
      expect(et?.stack).toContain("PostgreSQL");
      expect(et?.stack).toContain("JSON:API");
      // Node.js is personal projects, not Event Temple
      expect(et?.stack).not.toContain("Node.js");

      // Verify points contain database and migration highlights
      const pointsText = et?.points.join(" ") ?? "";
      expect(pointsText).toContain("1.5M+ records");
      expect(pointsText).toContain("PostgreSQL");
      expect(pointsText).toContain("lock");
    });

    it("retains authentic Front-End Developer title at Legalfit", () => {
      const lf = EXPERIENCE.find((e) => e.id === "lf");
      expect(lf).toBeDefined();
      expect(lf?.role).toBe("Front-End Developer");
    });

    it("does not contain em dashes in experience content", () => {
      for (const item of EXPERIENCE) {
        expect(item.year).not.toContain("—");
        expect(item.summary).not.toContain("—");
        for (const point of item.points) {
          expect(point).not.toContain("—");
        }
      }
    });
  });

  describe("Projects Section", () => {
    it("highlights Node.js and Hono in SublimeRead", () => {
      const sublimeread = PROJECTS.find((p) => p.id === "sublimeread");
      expect(sublimeread).toBeDefined();
      expect(sublimeread?.stack).toContain("Node.js");
      expect(sublimeread?.stack).toContain("Hono");
      expect(sublimeread?.stack).toContain("Cloudflare");
      expect(sublimeread?.blurb).toContain("Node.js");
      expect(sublimeread?.blurb).toContain("Hono");
    });

    it("does not contain em dashes in project content", () => {
      for (const project of PROJECTS) {
        expect(project.title).not.toContain("—");
        expect(project.blurb).not.toContain("—");
      }
    });
  });
});
