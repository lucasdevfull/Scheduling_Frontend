import { useServicesQuery } from '../query/use-services-query'
import type { ServicesQuery } from '@/types/services.types'
import { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'

export function useListServiceViewModel() {
  const { limit } = useLocalSearchParams<{ limit: string }>()
  const { data, error } = useServicesQuery(limit ? Number(limit) : 5)
  const [service, setSevice] = useState(data as { pages: Array<ServicesQuery> } | undefined)

  useEffect(() => {
    if (data) {
      setSevice(data as any)
    }
  }, [data])
  return { service, setSevice }
}
