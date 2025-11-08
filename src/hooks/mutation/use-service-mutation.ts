import type { CreateServiceResponse, ErrorResponse } from '@/types/responses.types'
import type { Service } from '@/types/services.types'
import { http } from '@/utils/http'
import { getToken } from '@/utils/token'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { Alert } from 'react-native'

export function useServicesMutation() {
  const router = useRouter()
  return useMutation({
    mutationKey: ['create_service'],
    mutationFn: async (body: Service) => {
      const accessToken = await getToken('access')
      console.log({ accessToken })
      console.log(body)
      const { data, error, ok } = await http.post<CreateServiceResponse, ErrorResponse>(
        'api/services',
        {
          body,
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )
      if (data instanceof Blob) {
        throw new Error('Erro de conexão com o servidor')
      }

      if (!ok) {
        throw error
      }


      return data!
    },
    onSuccess: async ({ data, statusCode }) => {
      if (statusCode === 201) {
        Alert.alert('Sucesso', 'Serviço cadastrado com sucesso')
        router.push('/(public)/service')
      }
    },
  })
}
