import { z } from "zod"

export const loginSchema = z.object({
  username: z.string({ error: "Campo de usuário é obrigatório"}).min(1, {error: "Campo de usuário é obrigatório"}),
  password: z.string({ error: "Campo de senha é obrigatório" }).min(1, {error: "Campo de senha é obrigatório"})
})

