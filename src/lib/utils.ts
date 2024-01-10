import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes without conflict.
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { cn };
