import { serviceSchema } from '@/schema/service.schema'
import { z } from 'zod'

export type Services = Array<{
  id: number
  name: string
  availabilities: Array<{
    id: number
    dayId: number
    startTime: Date | string
    endTime: Date | string
  }>
}>

export type ServicesQuery = {
  data: Services
  hasNextPage: boolean
  nextCursor: number | null
}

export type Service = z.infer<typeof serviceSchema>
