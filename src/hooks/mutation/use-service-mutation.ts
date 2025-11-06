import type { Service } from '@/types/services.types'
import { http } from '@/utils/http'
import { getToken } from '@/utils/token'
import { useMutation } from '@tanstack/react-query'

export function useServicesMutation() {
  return useMutation({
    mutationKey: ['create_service'],
    mutationFn: async (body: Service) => {
      const accessToken = await getToken('access')
      const { data, error, ok } = await http.post('api/services', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      if (!ok) {
        throw error
      }

      if (data === null || data instanceof Blob) {
        throw new Error('Erro de conexão com o servidor')
      }

      return data
    },
  })
}
