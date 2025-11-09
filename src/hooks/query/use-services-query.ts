import { AvailabilitiesRepository } from '@/db/repository/availiabilities'
import { ServicesQuery } from '@/types/services.types'
import { getToken } from '@/utils/token'
import { useInfiniteQuery } from '@tanstack/react-query'

export function useServicesQuery(limit: number) {
  return useInfiniteQuery<ServicesQuery, Error, ServicesQuery>({
    queryKey: ['services', limit],
    queryFn: async ({ pageParam }) => {
      const cursor = !pageParam ? 0 : pageParam
      const repo =  new AvailabilitiesRepository()
      const data = await repo.findAll(limit, Number(cursor))
      // const { data, ok, error } = await http.get<ServicesResponse, ErrorResponse>(
      //   `api/services?cursor=${pageParam ?? 0}`,
      //   {
      //     headers: {
      //       'Authorization': `Bearer ${accessToken}`,
      //     },
      //   }
      // )

      // if (!ok) {
      //   throw error
      // }
      // if (data === null || data instanceof Blob) {
      //   throw new Error('Erro de conexão com o servidor')
      // }
      return data
    },
    initialPageParam: 0,
    getNextPageParam: (lastpage, pages) => lastpage.nextCursor,
  })
}
