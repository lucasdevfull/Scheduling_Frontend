import AsyncStorage from '@react-native-async-storage/async-storage'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { setItemAsync } from 'expo-secure-store'
import { env } from '../env'
import type { Login } from '../types/login.types'
import type { TokenResponse } from '../types/responses.types'
import { http } from '../utils/http'

export function useLoginMutation() {
  const router = useRouter()
  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (body: Login) => {
      const { data, error, ok } = await http.post<TokenResponse, Error>(
        `/api/auth/token?x-vercel-protection-bypass=${env.EXPO_PUBLIC_VERCEL_BYPASS}`,
        {
          body,
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
    onSuccess: async ({ data }) => {
      if (data) {
        await setItemAsync('access', data.accessToken)
        await setItemAsync('refresh', data.accessToken)
        await AsyncStorage.setItem('role', data.role)
        router.navigate('/(public)/service')
      }
    },
  })
}
