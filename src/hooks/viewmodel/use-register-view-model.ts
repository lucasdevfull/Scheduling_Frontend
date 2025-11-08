import type { Register } from '@/types/register.types'
import { useRegisterForm } from '../mutation/use-register-form'
import { useRegisterMutation } from '../mutation/use-register-mutation'
import { Alert } from 'react-native'

export function useRegisterViewModel() {
  const { mutateAsync, error, isPending } = useRegisterMutation()
  const { control, handleSubmit, errors } = useRegisterForm()

  const onSubmit = async (data: Register) => {
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
