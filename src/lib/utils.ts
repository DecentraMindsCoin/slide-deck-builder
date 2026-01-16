/**
 * Utility functions for common operations
 */

/**
 * Combines class names conditionally
 * Useful for dynamic Tailwind classes
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Delays execution for a specified time
 * @param ms - Milliseconds to delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Truncates text to a specified length
 * @param text - Text to truncate
 * @param length - Maximum length
 * @param suffix - Suffix to add (default: '...')
 */
export const truncate = (text: string, length: number, suffix = '...'): string => {
  if (text.length <= length) return text;
  return text.slice(0, length) + suffix;
};

/**
 * Formats a date to a readable string
 * @param date - Date to format
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

/**
 * Formats a timestamp to relative time (e.g., "Just now", "5m ago", "2h ago")
 * @param timestamp - Unix timestamp in milliseconds
 */
export const formatRelativeTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

/**
 * Generates a unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
