import { ROLE } from '@/constants/roles'
import { useServicesQuery } from '@/hooks/query/use-services-query'
import { useRole } from '@/hooks/use-role'
import { useRouter } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'

export default function ServicePage() {
  const router = useRouter()
  const { role } = useRole()
  const { data } = useServicesQuery()
  console.log(data)
  return (
    <View>
      {role === ROLE.ADMIN ? (
        <TouchableOpacity
          onPress={() => router.push('/(public)/create-service')}
        >
          <Text>create</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}
