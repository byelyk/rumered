import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateAverage(scores: number[]): number {
  if (scores.length === 0) return 0;
  return Number(
    (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1)
  );
}

export function sanitizeText(text: string): string {
  return text.replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim();
}
