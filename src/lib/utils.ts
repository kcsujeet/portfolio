import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateYearsOfExperience(startDate: Date): number {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - startDate.getTime());
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25); // Account for leap years
  return Math.floor(diffYears);
}
