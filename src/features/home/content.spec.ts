import { describe, expect, it } from "bun:test";
import { JOB_TITLE } from "@/config/constants";
import { EXPERIENCE, LAYERS, PROJECTS } from "./data";

const EM_DASH = "—";

describe("Portfolio Content - Backend & Infrastructure Focus", () => {
  describe("Job Title & Layers", () => {
    it("keeps the real job title", () => {
      expect(JOB_TITLE).toBe("Senior Full-Stack Engineer");
    });

    it("draws the system from surface down to infrastructure", () => {
      expect(LAYERS.map((l) => l.layer)).toEqual([
        "surface",
        "api",
        "data",
        "infra",
      ]);
    });

    it("puts Rails in the API layer and PostgreSQL in the data layer", () => {
      expect(LAYERS.find((l) => l.layer === "api")?.stack).toContain(
        "Ruby on Rails",
      );
      expect(LAYERS.find((l) => l.layer === "data")?.stack).toContain(
        "PostgreSQL",
      );
    });

    it("lists infrastructure tools without overclaiming", () => {
      const infra = LAYERS.find((l) => l.layer === "infra")?.stack ?? [];
      expect(infra).toContain("Docker");
      expect(infra).toContain("AWS");
      expect(infra).toContain("Cloudflare Workers");
      expect(infra).not.toContain("AWS (Cloud & Infra)");
    });
  });

  describe("Experience Section", () => {
    it("contains only real employers", () => {
      expect(EXPERIENCE.map((e) => e.id)).toEqual(["et", "lf", "tv"]);
    });

    it("marks Event Temple as touching every layer", () => {
      const et = EXPERIENCE.find((e) => e.id === "et");
      expect(et?.layers).toEqual(["surface", "api", "data", "infra"]);
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

    it("frames Tekvortex around Rails and PostgreSQL", () => {
      const tv = EXPERIENCE.find((e) => e.id === "tv");
      expect(tv?.lede).toContain("Rails and PostgreSQL");
    });

    it("contains no em dashes", () => {
      for (const item of EXPERIENCE) {
        const text = [item.years, item.lede, ...item.points].join(" ");
        expect(text).not.toContain(EM_DASH);
      }
    });
  });

  describe("Projects Section", () => {
    it("describes the SublimeRead backend: Workers, D1, R2, Stripe", () => {
      const sublimeread = PROJECTS.find((p) => p.id === "sublimeread");
      expect(sublimeread?.line).toContain("on-device");
      expect(sublimeread?.line).toContain("Stripe");
      expect(sublimeread?.stack.slice(0, 3)).toEqual(["workers", "d1", "r2"]);
      expect(sublimeread?.stack).not.toContain("hono");
    });

    it("places Interactive Rails before the frontend libraries", () => {
      const ids = PROJECTS.map((p) => p.id);
      expect(ids.indexOf("interactive-rails")).toBeLessThan(
        ids.indexOf("ilamy"),
      );
    });

    it("contains no em dashes", () => {
      for (const project of PROJECTS) {
        expect(`${project.name} ${project.line}`).not.toContain(EM_DASH);
      }
    });
  });
});
