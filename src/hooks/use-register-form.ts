import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../schema/register.schema'
import type { Register } from '../types/register.types'

export function useRegisterForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Register>({
    resolver: zodResolver(registerSchema),
  })

  return { control, handleSubmit, errors }
}
