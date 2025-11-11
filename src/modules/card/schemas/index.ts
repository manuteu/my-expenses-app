import { z } from "zod";

export const createCardSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.enum(["credit", "debit"], {
    required_error: "Tipo é obrigatório",
  }),
  lastDigits: z
    .string()
    .min(4, "Digite os 4 últimos dígitos")
    .max(4, "Digite apenas os 4 últimos dígitos")
    .regex(/^\d+$/, "Apenas números"),
  flag: z.string().min(1, "Bandeira é obrigatória"),
  bank: z.string().min(1, "Banco é obrigatório"),
});

export type CreateCardFormData = z.infer<typeof createCardSchema>;

