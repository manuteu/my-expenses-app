import { z } from "zod";

// Schema base para método sem cartão
const baseMethodSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.enum(["card", "transfer", "cash"], {
    required_error: "Tipo é obrigatório",
  }),
});

// Schema quando o tipo é 'card', requer o ID do cartão
const methodWithCardSchema = baseMethodSchema.extend({
  type: z.literal("card"),
  card: z.string().min(1, "Selecione um cartão"),
});

// Schema quando o tipo não é 'card'
const methodWithoutCardSchema = baseMethodSchema.extend({
  type: z.enum(["transfer", "cash"]),
});

// Union dos dois schemas
export const createMethodSchema = z.discriminatedUnion("type", [
  methodWithCardSchema,
  methodWithoutCardSchema,
]);

export type CreateMethodFormData = z.infer<typeof createMethodSchema>;

// Tipo para o input da API
export interface CreateMethodInput {
  name: string;
  type: "card" | "transfer" | "cash";
  card?: string;
}

