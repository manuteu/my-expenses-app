import { z } from 'zod';

export const importUploadSchema = z.object({
  bank: z.enum(['nubank'], { required_error: 'Selecione um banco' }),
  statementType: z.enum(['extrato', 'fatura'], {
    required_error: 'Selecione o tipo de extrato',
  }),
  file: z.instanceof(File, { message: 'Selecione um arquivo CSV' }),
});

export type ImportUploadFormData = z.infer<typeof importUploadSchema>;

export const importReviewSchema = z.object({
  expenses: z
    .array(
      z.object({
        date: z.string(),
        amount: z.number(),
        description: z.string().optional(),
        category: z.string().min(1, 'Selecione uma categoria'),
        method: z.string().min(1, 'Selecione um método'),
      }),
    )
    .min(1),
});

export type ImportReviewFormData = z.infer<typeof importReviewSchema>;
