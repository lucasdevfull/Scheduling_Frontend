import { useServicesQuery } from '../query/use-services-query'
import type { ServicesQuery, UpdateService } from '@/types/services.types'
import { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { Alert } from 'react-native'
import { AvailabilitiesRepository } from '@/db/repository/availiabilities'
import { useQueryClient } from '@tanstack/react-query'

export function useListServiceViewModel() {
  const { limit } = useLocalSearchParams<{ limit: string }>()
  const { data, error } = useServicesQuery(limit ? Number(limit) : 5)
  const [service, setSevice] = useState(data as { pages: Array<ServicesQuery> } | undefined)
  const [del, setDel] = useState<boolean | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (data) {
      setSevice(data as any)
    }
  }, [data])
  const onDelete = async ({ id, availabilities }: UpdateService) => {
    // Alert.alert(
    //   'Confirmação', // Título
    //   'Você tem certeza que deseja continuar?', // Mensagem
    //   [
    //     {
    //       text: 'Cancelar',
    //       onPress: () => setDel(false),
    //       style: 'cancel', // deixa o botão com estilo de cancelamento no iOS
    //     },
    //     {
    //       text: 'Confirmar',
    //       onPress: () => setDel(true),
    //     },
    //   ],
    //   { cancelable: false } // impede fechar tocando fora do alerta
    // )

    // if (!del) {
    //   return
    // }

    const repo = new AvailabilitiesRepository()
    for (const a of availabilities) {
      await repo.deleteAvailabilities(a.id, id)
    }
    const idRemove = await repo.delete(id)

    if (idRemove.deleted) {
      const s = service?.pages[0].data.filter(s => s.id !== idRemove.id)
      const data = {
        pages: [
          {
            data: s,
          },
        ],
      }
      setSevice(data as any)
      queryClient.invalidateQueries({ queryKey: ['services'] })
    }
  }
  return { service, setSevice, onDelete }
}
