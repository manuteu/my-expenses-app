import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.string(),
  VITE_ENVIRONMENT: z.enum(['DEV', 'PROD']),
});

export const env = envSchema.parse(import.meta.env)