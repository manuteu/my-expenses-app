import { startOfMonth, endOfMonth } from "date-fns";

/**
 * Retorna o range do mês atual (primeiro e último dia)
 */
export function getCurrentMonthRange() {
  const now = new Date();
  return {
    from: startOfMonth(now),
    to: endOfMonth(now),
  };
}

