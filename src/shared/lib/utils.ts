import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-exporta utilitários de moeda
export {
  formatCentsToCurrency,
  formatCentsToInput,
  parseCurrencyToCents,
  applyCurrencyMask,
} from './currency';
