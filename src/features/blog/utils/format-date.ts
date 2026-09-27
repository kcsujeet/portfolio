export type DateFormat = "month-year" | "full";

// Posts carry an explicit offset (content.config.ts); format in the author's
// zone so a late-night post never shows up dated a day later.
const TIME_ZONE = "America/Vancouver";

export function formatDate(date: Date, format: DateFormat): string {
  switch (format) {
    case "month-year":
      return date.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
        timeZone: TIME_ZONE,
      });
    case "full":
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: TIME_ZONE,
      });
  }
}
