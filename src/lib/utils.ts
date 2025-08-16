import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function getGradientColor(value: number, max: number): string {
  const percentage = (value / max) * 100
  if (percentage >= 80) return 'from-emerald-500 to-emerald-600'
  if (percentage >= 60) return 'from-blue-500 to-blue-600'
  if (percentage >= 40) return 'from-yellow-500 to-yellow-600'
  if (percentage >= 20) return 'from-orange-500 to-orange-600'
  return 'from-red-500 to-red-600'
}