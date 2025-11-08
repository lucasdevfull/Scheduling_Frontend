import { Service } from '@/types/services.types'
import { useServicesMutation } from '../mutation/use-service-mutation'
import { Alert } from 'react-native'

export function useCreateServiceViewModel() {
  const { mutateAsync, error, isPending } = useServicesMutation()
  const onSubmit = async (data: Service) => {
    console.log('payload pronto:', data)
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
