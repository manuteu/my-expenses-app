export const PAYMENT_METHOD_TYPES = [
  { value: "card", label: "Cartão" },
  { value: "transfer", label: "Transferência" },
  { value: "cash", label: "Dinheiro" },
] as const;

export const PAYMENT_METHOD_ICONS: Record<string, string> = {
  card: "💳",
  transfer: "🏦",
  cash: "💵",
};

export const PAYMENT_METHOD_COLORS: Record<string, string> = {
  card: "from-blue-500 to-blue-600",
  transfer: "from-green-500 to-green-600",
  cash: "from-emerald-500 to-emerald-600",
};

