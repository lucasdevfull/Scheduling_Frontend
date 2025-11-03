import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { loginSchema } from '../../schema/login.schema'
import type { Login } from '../../types/login.types'

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
