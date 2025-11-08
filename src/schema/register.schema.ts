import { z } from 'zod'

export const registerSchema = z
  .object({
    name: z
      .string({ error: 'Campo de usuário é obrigatório' })
      .min(1, { error: 'Campo de usuário é obrigatório' }),
    email: z.email({ error: 'Campo email inválido' }),
    password: z
      .string({ error: 'Campo de senha é obrigatório' })
      .min(1, { error: 'Campo de senha é obrigatório' }),
    confirmPassword: z.string().min(8, { message: 'A senha deve ter pelo menos 8 caracteres' }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'As senhas devem ser iguais',
    path: ['confirmPassword'],
  })
