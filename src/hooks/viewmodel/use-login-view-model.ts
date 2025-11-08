import type { Login } from '@/types/login.types'
import { Alert } from 'react-native'
import { useLoginForm } from '../mutation/use-login-form'
import { useLoginMutation } from '../mutation/use-login-mutation'

export function useLoginViewModel() {
  const { control, errors, handleSubmit } = useLoginForm()
  const { mutateAsync, error, isPending } = useLoginMutation()
  const onSubmit = async (data: Login) => {
    try {
      await mutateAsync(data)
    } catch (err: any) {
      Alert.alert('Error', err.message)
    }
    if (error) {
      Alert.alert('Error', error.message)
    }
  }
  return {
    control,
    handleSubmit,
    errors,
    isPending,
    onSubmit,
  }
}
