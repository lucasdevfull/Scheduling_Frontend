import { env } from './env'
import { http } from './utils/http'

async function main() {
  const body = {
    username: 'teste',
    email: 'teste@gmail.com',
    password: '12345678',
  }
  const registerResponse = await http.post<Response, Error>(
    `api/user?x-vercel-protection-bypass=${env.EXPO_PUBLIC_VERCEL_BYPASS}`,
    {
      body,
    }
  )
  console.log(registerResponse)
}

main()
