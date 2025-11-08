import { env } from './env'
import { serviceSchema } from './schema/service.schema'
import { http } from './utils/http'

const token =
  'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NjI2MzI4NDMsInN1YiI6ImQ2Y2Q2ZDcxLTYwYzItNDYxYS04NzZlLTBmNGE0YWY4MWIyZCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MjYyOTI0MywidHlwZSI6ImFjY2VzcyJ9.t0uMGN0KP5NfcdZNXG8y3r0xHLrWJ1PQ_Ru1Hc-t8Es'
async function main() {
  const body = {
    // username: 'teste',
    // email: 'teste@gmail.com',
    // password: '12345678'
    name: 'Teste',
    availabilities: [{ dayId: 3, endTime: '17:14', startTime: '16:14' }],
  }
  const p = serviceSchema.parse(body)
  const response = await http.post(
     `api/services?x-vercel-protection-bypass=${env.EXPO_PUBLIC_VERCEL_BYPASS}`,
     {
       headers: {
         Authorization: `Bearer ${token}`,
       },
       body: p,
     }
   )
  //  const response = await http.post<Response, Error>(
  //    `api/user?x-vercel-protection-bypass=${env.EXPO_PUBLIC_VERCEL_BYPASS}`,
  //    {
  //      body,
  //    }
  //  )
  console.log(response)
}

main()
