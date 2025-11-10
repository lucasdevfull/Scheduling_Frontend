import { AvailabilitiesRepository } from '@/db/repository/availiabilities'
import type { Service, UpdateService } from '@/types/services.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { Alert } from 'react-native'

export function useServicesMutation() {
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['create_service'],
    mutationFn: async (body: Service) => {
      const repo = new AvailabilitiesRepository()
      const data = (await repo.create(body)) as UpdateService
      // console.log(serviceSchema.parse(body))
      // const { data, error, ok } = await http.post<CreateServiceResponse, ErrorResponse>(
      //   'api/services',
      //   {
      //     body,
      //     headers: {
      //       'Authorization': `Bearer ${accessToken}`,
      //     },
      //   }
      // )
      // if (data instanceof Blob) {
      //   throw new Error('Erro de conexão com o servidor')
      // }

      // if (!ok) {
      //   throw error
      // }

      return data!
    },
    onSuccess: async () => {
      Alert.alert('Sucesso', 'Serviço cadastrado com sucesso')
      queryClient.invalidateQueries({ queryKey: ['services'] })
      router.push('/(public)/service')
    },
  })
}
