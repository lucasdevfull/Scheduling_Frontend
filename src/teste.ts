import { AvailabilitiesRepository } from './db/repository/availiabilities'

const token =
  'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NjI2NTI4MDYsInN1YiI6ImQ2Y2Q2ZDcxLTYwYzItNDYxYS04NzZlLTBmNGE0YWY4MWIyZCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MjY0OTIwNiwidHlwZSI6ImFjY2VzcyJ9.GshD77mbnhGKz26ve9osH2b6WC4jHcFe1WP9sFApow4'

async function main() {
  // const body = {
  //   // username: 'teste',
  //   // email: 'teste@gmail.com',
  //   // password: '12345678'
  //   name: 'Teste',
  //   availabilities: [{ dayId: 3, endTime: '17:14', startTime: '16:14' }],
  // }
  // const p = serviceSchema.parse(body)
  // const response = await http.post(
  //   `http://localhost:3000/api/services`,
  //   //`api/services?x-vercel-protection-bypass=${env.EXPO_PUBLIC_VERCEL_BYPASS}`,
  //    {
  //      headers: {
  //        'Authorization': `Bearer ${token}`,
  //      },
  //      body: p,
  //    }
  //  )
  // //  const response = await http.post<Response, Error>(
  //    `api/user?x-vercel-protection-bypass=${env.EXPO_PUBLIC_VERCEL_BYPASS}`,
  //    {
  //      body,
  //    }
  //  )
  const repo = new AvailabilitiesRepository()
  const data = await repo.findAll(5, 0)
  console.log(data.data)
}

main()
