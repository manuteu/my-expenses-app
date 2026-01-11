import { z } from "zod";

// Validador customizado para valores monetários
const currencyValidator = z.string()
  .min(1, "Valor é obrigatório")
  .refine((val) => {
    // Remove formatação e verifica se é um número válido
    const cleaned = val.replace(/\./g, '').replace(',', '.');
    const num = parseFloat(cleaned);
    return !isNaN(num) && num > 0;
  }, "Valor deve ser maior que zero");

// Schema para despesa simples
export const createSimpleExpenseSchema = z.object({
  amount: currencyValidator,
  category: z.string().min(1, "Categoria é obrigatória"),
  method: z.string().min(1, "Método de pagamento é obrigatório"),
  date: z.date({ required_error: "Data é obrigatória" }),
  description: z.string().optional(),
  type: z.literal('simple'),
});

// Schema para despesa parcelada
export const createInstallmentExpenseSchema = z.object({
  totalAmount: currencyValidator,
  installments: z.string().min(1, "Número de parcelas é obrigatório"),
  category: z.string().min(1, "Categoria é obrigatória"),
  method: z.string().min(1, "Método de pagamento é obrigatório"),
  startDate: z.date({ required_error: "Data é obrigatória" }),
  description: z.string().min(1, "Descrição é obrigatória para despesas parceladas"),
  type: z.literal('installment'),
});

// Schema para despesa recorrente
export const createRecurringExpenseSchema = z.object({
  amount: currencyValidator,
  category: z.string().min(1, "Categoria é obrigatória"),
  method: z.string().min(1, "Método de pagamento é obrigatório"),
  startDate: z.date({ required_error: "Data é obrigatória" }),
  description: z.string().min(1, "Descrição é obrigatória para despesas recorrentes"),
  type: z.literal('recurring'),
  monthsToGenerate: z.string().optional(),
});

// Discriminated union dos schemas
export const createExpenseSchema = z.discriminatedUnion('type', [
  createSimpleExpenseSchema,
  createInstallmentExpenseSchema,
  createRecurringExpenseSchema,
]);

export type CreateExpenseFormData = z.infer<typeof createExpenseSchema>;

// ========================================
// SCHEMAS PARA EDIÇÃO DE DESPESAS
// ========================================

// Validador customizado opcional para valores monetários
const optionalCurrencyValidator = z.string()
  .optional()
  .refine((val) => {
    if (!val) return true; // Se não foi fornecido, tudo ok
    // Remove formatação e verifica se é um número válido
    const cleaned = val.replace(/\./g, '').replace(',', '.');
    const num = parseFloat(cleaned);
    return !isNaN(num) && num > 0;
  }, "Valor deve ser maior que zero");

// Schema para edição de despesa simples
export const updateSimpleExpenseSchema = z.object({
  amount: optionalCurrencyValidator,
  category: z.string().optional(),
  method: z.string().optional(),
  date: z.date().optional(),
  description: z.string().optional(),
  type: z.literal('simple').optional(),
  updateScope: z.enum(['single', 'all', 'future']).optional(),
});

// Schema para edição de despesa parcelada
export const updateInstallmentExpenseSchema = z.object({
  amount: optionalCurrencyValidator,
  totalAmount: optionalCurrencyValidator,
  installments: z.string().optional(),
  category: z.string().optional(),
  method: z.string().optional(),
  date: z.date().optional(),
  startDate: z.date().optional(),
  description: z.string().optional(),
  type: z.literal('installment').optional(),
  updateScope: z.enum(['single', 'all', 'future']).optional(),
});

// Schema para edição de despesa recorrente
export const updateRecurringExpenseSchema = z.object({
  amount: optionalCurrencyValidator,
  category: z.string().optional(),
  method: z.string().optional(),
  date: z.date().optional(),
  startDate: z.date().optional(),
  description: z.string().optional(),
  type: z.literal('recurring').optional(),
  monthsToGenerate: z.string().optional(),
  updateScope: z.enum(['single', 'all', 'future']).optional(),
});

// Union de schemas para edição (não discriminada pois todos os campos são opcionais)
export const updateExpenseSchema = z.union([
  updateSimpleExpenseSchema,
  updateInstallmentExpenseSchema,
  updateRecurringExpenseSchema,
]);

export type UpdateExpenseFormData = z.infer<typeof updateExpenseSchema>;