/**
 * Merge class names, filtering out falsy values.
 * Lightweight alternative to clsx/classnames — no deps.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
