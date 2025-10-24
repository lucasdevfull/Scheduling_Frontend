import { z } from 'zod'

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.url().startsWith('https://'),
  EXPO_PUBLIC_VERCEL_BYPASS: z.string(),
})

export const env = envSchema.parse(process.env)
