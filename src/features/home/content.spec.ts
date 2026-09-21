import { describe, expect, it } from "bun:test";
import { JOB_TITLE } from "@/config/constants";
import { EXPERIENCE, PROJECTS, STACK } from "./data";

const EM_DASH = "—";

describe("Portfolio Content - Backend & Infrastructure Focus", () => {
  describe("Job Title & Core Stack", () => {
    it("keeps the real job title", () => {
      expect(JOB_TITLE).toBe("Senior Full-Stack Engineer");
    });

    it("leads the core stack with backend technologies", () => {
      expect(STACK.slice(0, 3)).toEqual([
        "Ruby on Rails",
        "PostgreSQL",
        "REST & JSON:API",
      ]);
    });

    it("lists infrastructure tools without overclaiming", () => {
      expect(STACK).toContain("Docker");
      expect(STACK).toContain("AWS");
      expect(STACK).toContain("Cloudflare Workers");
      expect(STACK).not.toContain("AWS (Cloud & Infra)");
    });

    it("lists frontend tools after backend and infrastructure", () => {
      const backendIndex = STACK.indexOf("PostgreSQL");
      const infraIndex = STACK.indexOf("AWS");
      const frontendIndex = STACK.indexOf("React.js");
      expect(backendIndex).toBeLessThan(infraIndex);
      expect(infraIndex).toBeLessThan(frontendIndex);
    });
  });

  describe("Experience Section", () => {
    it("contains only real employers", () => {
      expect(EXPERIENCE.map((e) => e.id)).toEqual(["et", "lf", "tv"]);
    });

    it("keeps Event Temple on Rails and PostgreSQL, not Node.js", () => {
      const et = EXPERIENCE.find((e) => e.id === "et");
      expect(et?.stack).toContain("Ruby on Rails");
      expect(et?.stack).toContain("PostgreSQL");
      expect(et?.stack).toContain("JSON:API");
      expect(et?.stack).not.toContain("Node.js");
    });

    it("leads Event Temple points with backend work", () => {
      const et = EXPERIENCE.find((e) => e.id === "et");
      const [first, second, third] = et?.points ?? [];
      expect(first).toContain("JSON:API");
      expect(second).toContain("1.5M+ records");
      expect(third).toContain("PostgreSQL");
    });

    it("keeps the frontend migration point but lists it last", () => {
      const et = EXPERIENCE.find((e) => e.id === "et");
      const last = et?.points.at(-1) ?? "";
      expect(last).toContain("Next.js");
    });

    it("keeps the real Front-End Developer title at Legalfit", () => {
      const lf = EXPERIENCE.find((e) => e.id === "lf");
      expect(lf?.role).toBe("Front-End Developer");
    });

    it("frames Tekvortex around the Rails and PostgreSQL backend", () => {
      const tv = EXPERIENCE.find((e) => e.id === "tv");
      expect(tv?.impact).toBe("Rails & PostgreSQL Backend");
    });

    it("contains no em dashes", () => {
      for (const item of EXPERIENCE) {
        const text = [item.year, item.summary, ...item.points].join(" ");
        expect(text).not.toContain(EM_DASH);
      }
    });
  });

  describe("Projects Section", () => {
    it("leads with the backend-heavy project", () => {
      expect(PROJECTS[0]?.id).toBe("sublimeread");
      expect(PROJECTS[0]?.featured).toBe(true);
    });

    it("describes the SublimeRead backend", () => {
      const sublimeread = PROJECTS.find((p) => p.id === "sublimeread");
      expect(sublimeread?.stack.slice(0, 3)).toEqual([
        "Node.js",
        "Hono",
        "Cloudflare Workers",
      ]);
      expect(sublimeread?.blurb).toContain("backend");
    });

    it("places Interactive Rails before the frontend libraries", () => {
      const ids = PROJECTS.map((p) => p.id);
      expect(ids.indexOf("interactive-rails")).toBeLessThan(
        ids.indexOf("ilamy"),
      );
    });

    it("contains no em dashes", () => {
      for (const project of PROJECTS) {
        expect(`${project.title} ${project.blurb}`).not.toContain(EM_DASH);
      }
    });
  });
});
