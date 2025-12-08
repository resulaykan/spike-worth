import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(timestamp: number | string | Date): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Az önce';
  }

  const rtf = new Intl.RelativeTimeFormat('tr', { numeric: 'auto' });

  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return rtf.format(-minutes, 'minute');

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return rtf.format(-hours, 'hour');

  const days = Math.floor(hours / 24);
  if (days < 30) return rtf.format(-days, 'day');

  const months = Math.floor(days / 30);
  if (months < 12) return rtf.format(-months, 'month');

  const years = Math.floor(days / 365);
  return rtf.format(-years, 'year');
}
