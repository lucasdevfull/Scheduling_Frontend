import type { Services } from './services.types'

export type Response<T = undefined> = {
  statusCode: number
  error: string | null
  message?: string
  data: T
}

export type ErrorResponse = Omit<Response, 'data'>

export type TokenResponse = Response<{
  accessToken: string
  refreshToken: string
  role: 'admin' | 'user'
}>

export type ServicesResponse = Response<Services> & {
  hasNextPage: boolean
  nextCursor: number | null
}
