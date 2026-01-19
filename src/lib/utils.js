/*
  utils.js
  - Small collection of UI helpers; `cn` is a className merger used across components.
  - Wraps `clsx` with `twMerge` to correctly collapse Tailwind namespaces.
*/
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
