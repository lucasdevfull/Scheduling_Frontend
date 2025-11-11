import AsyncStorage from '@react-native-async-storage/async-storage'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { setItemAsync } from 'expo-secure-store'
import { env } from '../../env'
import { Register } from '../../types/register.types'
import { Response, TokenResponse } from '../../types/responses.types'
import { http } from '../../utils/http'
import { Alert, Platform } from 'react-native'

export function useRegisterMutation() {
  const router = useRouter()
  return useMutation({
    mutationKey: ['register'],
    mutationFn: async (body: Register) => {
      const registerResponse = await http.post<Response, Error>(
        `api/user?x-vercel-protection-bypass=${env.EXPO_PUBLIC_VERCEL_BYPASS}`,
        {
          body,
        }
      )
      console.log(registerResponse.data)
      if (registerResponse.data instanceof Blob) {
        throw new Error('Erro de conexão com o servidor')
      }
      if (!registerResponse.ok) {
        throw registerResponse.error
      }

      const loginResponse = await http.post<TokenResponse, Error>(
        `api/auth/token?x-vercel-protection-bypass=${env.EXPO_PUBLIC_VERCEL_BYPASS}`,
        {
          body: {
            email: body.email,
            password: body.password,
          },
        }
      )
      if (loginResponse.data instanceof Blob) {
        throw new Error('Erro de conexão com o servidor')
      }
      if (!loginResponse.ok) {
        throw loginResponse.error
      }
      return loginResponse.data!
    },
    onSuccess: async ({ data }) => {
      if (data) {
        if (Platform.OS === 'web') {
          await AsyncStorage.setItem('access', data.accessToken)
          await AsyncStorage.setItem('refresh', data.accessToken)
        } else {
          await setItemAsync('access', data.accessToken)
          await setItemAsync('refresh', data.accessToken)
        }
        await AsyncStorage.setItem('role', data.role)
        Alert.alert('Mensagem', 'Cadastro realizado com sucesso')
        router.navigate({
          pathname: '/(public)/service',
          params: {
            limit: 5,
          },
        })
      }
    },
  })
}
