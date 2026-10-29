import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names with conditional classes.
 * Uses clsx for conditionals and tailwind-merge for deduplication.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as currency using Intl.NumberFormat.
 * Defaults to BDT but supports any currency code.
 */
export function formatCurrency(
  amount: number,
  currency = "BDT",
  locale = "en-BD"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a number to exactly 2 decimal places (BL-14 compliance).
 */
export function formatFixedDecimal(value: number, decimals = 2): string {
  return value.toFixed(decimals);
}

/**
 * Generate initials from a full name (for avatar fallbacks).
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Truncate a string to a maximum length, adding ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + "…";
}
