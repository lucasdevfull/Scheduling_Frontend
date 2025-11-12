import { ServiceForm } from '@/components/service-form'
import { AvailabilitiesRepository } from '@/db/repository/availiabilities'
import { useUpdateServiceViewModel } from '@/hooks/viewmodel/use-update-service-view-model'
import { UpdateService } from '@/types/services.types'
import { srtToTime, timeToHHMM } from '@/utils/datetime'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { View } from 'react-native'

export default function UpdateServicePage() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [service, setService] = useState<UpdateService | null>(null)
  const { onSubmit, isPending } = useUpdateServiceViewModel()
  useEffect(() => {
    const getService = async (id: number) => {
      const repo = new AvailabilitiesRepository()
      const data = await repo.findById(id)
      const serv = {
        ...data,
        availabilities: data?.availabilities.map(a => {
          const startTime = timeToHHMM(srtToTime(new Date(a.startTime!).toTimeString()))
          const endTime = timeToHHMM(srtToTime(new Date(a.endTime!).toTimeString()))
          return {
            ...a,
            startTime,
            endTime,
          }
        }),
      }
      setService(serv as any)
    }
    getService(Number(id))
  }, [])
  return (
    <View style={{ padding: 12 }}>
      <ServiceForm initialData={service!} onSubmit={onSubmit} isPending={isPending} />
    </View>
  )
}
