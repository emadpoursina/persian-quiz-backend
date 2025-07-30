import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
};
