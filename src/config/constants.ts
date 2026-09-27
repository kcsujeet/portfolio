export const JOB_TITLE = "Senior Full-Stack Engineer";
export const NAME = "Sujeet Kc";
export const SITE_URL = "https://kcsujeet.com.np/";
export const START_DATE = new Date("2019-02-01");
export const EMAIL = "sujeetkc45@gmail.com";

/** Build-time date; the site is static, so this is when it was last built. */
export const BUILD_DATE = new Date();

/** Whole years of professional experience as of the build. */
export const YEARS_EXPERIENCE = (() => {
  const years = BUILD_DATE.getFullYear() - START_DATE.getFullYear();
  const beforeAnniversary =
    BUILD_DATE.getMonth() < START_DATE.getMonth() ||
    (BUILD_DATE.getMonth() === START_DATE.getMonth() &&
      BUILD_DATE.getDate() < START_DATE.getDate());
  return beforeAnniversary ? years - 1 : years;
})();

const NUMBER_WORDS = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
];

/** Years of experience spelled out for prose, e.g. "Seven". */
export const YEARS_IN_WORDS =
  NUMBER_WORDS[YEARS_EXPERIENCE] ?? String(YEARS_EXPERIENCE);

export const SOCIAL = [
  {
    label: "GitHub",
    handle: "github.com/kcsujeet",
    href: "https://github.com/kcsujeet",
  },
  {
    label: "LinkedIn",
    handle: "linkedin.com/in/kc-sujeet",
    href: "https://linkedin.com/in/kc-sujeet",
  },
  {
    label: "dev.to",
    handle: "dev.to/kcsujeet",
    href: "https://dev.to/kcsujeet",
  },
] as const;
