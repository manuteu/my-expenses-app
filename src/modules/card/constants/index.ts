export const CARD_FLAGS = [
  "visa",
  "mastercard",
  "elo",
  "american-express",
  "hipercard",
  "diners",
  "other",
] as const;

export const CARD_FLAG_LABELS: Record<string, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  elo: "Elo",
  "american-express": "American Express",
  hipercard: "Hipercard",
  diners: "Diners Club",
  other: "Outro",
};

export const CARD_TYPE_LABELS: Record<string, string> = {
  credit: "Crédito",
  debit: "Débito",
};

export const CARD_COLORS: Record<string, string> = {
  visa: "from-blue-500 to-blue-700",
  mastercard: "from-red-500 to-orange-600",
  elo: "from-yellow-500 to-yellow-700",
  "american-express": "from-teal-500 to-teal-700",
  hipercard: "from-red-600 to-red-800",
  diners: "from-blue-600 to-blue-800",
  other: "from-gray-500 to-gray-700",
};

