import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.string(),
});

console.log('🔍 ENV DEBUG:', import.meta.env.VITE_API_URL);
export const env = envSchema.parse(import.meta.env)