import type { UpdateService } from '@/types/services.types'
import { useUpdateServicesMutation } from '../mutation/use-service-mutation'
import { Alert } from 'react-native'

export function useUpdateServiceViewModel() {
  const { mutateAsync, error, isPending } = useUpdateServicesMutation()
  const onSubmit = async (data: UpdateService) => {
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
    onSubmit,
    isPending,
  }
}
