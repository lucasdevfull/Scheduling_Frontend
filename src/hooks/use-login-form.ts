import { useForm } from 'react-hook-form'
import type { Login } from '../types/login.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../schema/login.schema'

export function useLoginForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>({
    resolver: zodResolver(loginSchema),
  })

  return { control, handleSubmit, errors }
}
