import { z } from 'zod'
import { loginSchema } from '../schema/login.schema'

export type Login = z.infer<typeof loginSchema>
