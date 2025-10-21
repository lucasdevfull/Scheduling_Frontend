import { z } from "zod";

export const registerSchema = z.object({
    username: z.string({ error: "Campo de usuário é obrigatório"}).min(1, {error: "Campo de usuário é obrigatório"}),
    email: z.email({error: "Campo email inválido"}),
    password: z.string({ error: "Campo de senha é obrigatório" }).min(1, {error: "Campo de senha é obrigatório"})
})