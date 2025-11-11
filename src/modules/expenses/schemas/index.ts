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

