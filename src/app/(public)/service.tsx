import { ROLE } from '@/constants/roles'
import { useServicesQuery } from '@/hooks/query/use-services-query'
import { useRole } from '@/hooks/use-role'
import { Link, useRouter } from 'expo-router'
import { Button, Text, TouchableOpacity, View } from 'react-native'

export default function ServicePage() {
  const router = useRouter()
  const { role } = useRole()
  const query = useServicesQuery()
  return (
    <View>
      {role === ROLE.ADMIN ? <TouchableOpacity onPress={() => router.push('/(public)/create-service')}>create</TouchableOpacity>: null}
    </View>
  )
}
