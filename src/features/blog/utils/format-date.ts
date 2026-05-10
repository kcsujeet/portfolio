export type DateFormat = "year" | "month-day" | "full";

export function formatDate(date: Date, format: DateFormat): string {
  switch (format) {
    case "year":
      return date.getUTCFullYear().toString();
    case "month-day":
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      });
    case "full":
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      });
  }
}
