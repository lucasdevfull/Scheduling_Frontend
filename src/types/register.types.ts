import { z } from 'zod'
import { registerSchema } from '../schema/register.schema'

export type Register = z.infer<typeof registerSchema>
