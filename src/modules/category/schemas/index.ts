import { z } from "zod";

const optionalText = z
  .union([z.string(), z.literal("")])
  .optional()
  .transform((value) => {
    if (!value) return undefined;
    const trimmed = value.trim();
    return trimmed.length ? trimmed : undefined;
  });

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, "Nome da categoria é obrigatório").max(50),
  icon: optionalText,
  color: optionalText.refine(
    (value) => !value || /^#[0-9A-F]{6}$/i.test(value),
    "Cor deve ser um código hexadecimal válido (ex: #FF5733)"
  ),
});

export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
