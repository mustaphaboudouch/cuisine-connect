import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes without conflict.
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the first two letters of a user's name.
 */
function getUserTwoLetters(firstname: string, lastname: string) {
  return `${firstname[0]}${lastname[0]}`.toUpperCase();
}

export { cn, getUserTwoLetters };
