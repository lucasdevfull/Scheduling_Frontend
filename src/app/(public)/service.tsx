import { ROLE } from '@/constants/roles'
import { useServicesQuery } from '@/hooks/query/use-services-query'
import { useRole } from '@/hooks/use-role'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { styles } from '../../styles'
import { ServicesQuery } from '@/types/services.types'

export default function ServicePage() {
  const router = useRouter()
  const { limit } = useLocalSearchParams<{ limit: string }>()
  const { role } = useRole()
  const { data, error } = useServicesQuery(Number(limit))
  const d = data as { pages: Array<ServicesQuery>} | undefined
  return (
    <View style={styles.container}>
      {d === undefined ? (
        <Text style={styles.title}>Nenhum serviço Cadastrado. </Text>
      ) : (
        <FlatList
          data={d?.pages[0].data}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={<Text style={styles.link}>Nenhum serviço cadastrado.</Text>}
          renderItem={({ item }) => (
            <View style={styles.input}>
              {/* usando input só para reaproveitar padding/borda */}
              <Text style={styles.title}>{item.name}</Text>
              {/* <Text>{item.}</Text>
            <Text>
              📅 {item.data} ⏰ {item.hora}
            </Text> */}
            </View>
          )}
          contentContainerStyle={
            d.pages[0].data.length === 0 && { flexGrow: 1, justifyContent: 'center' }
          }
        />
      )}

      {role === ROLE.ADMIN ? (
        <TouchableOpacity style={styles.link} onPress={() => router.push('/create-service')}>
          <Text style={styles.link}>＋ Adicionar Serviço</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}