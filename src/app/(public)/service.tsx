import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { styles } from '../styles'
import { useRole } from '@/hooks/use-role'
import { ROLE } from '@/constants/roles'
import { useServicesQuery } from '@/hooks/query/use-services-query'
import React from 'react'

export default function ServicePage() {
  const router = useRouter()
  const { role } = useRole()
  const { data } = useServicesQuery()

  return (
    <View style={styles.container}>
      {data === undefined ? (
        <Text style={styles.title}>Nenhum serviço Cadastrado. </Text>
      ) : (
        <FlatList
          data={data.data}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.link}>Nenhum serviço cadastrado.</Text>
          }
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
            data.data.length === 0 && { flexGrow: 1, justifyContent: 'center' }
          }
        />
      )}

      {role === ROLE.ADMIN ? (
        <TouchableOpacity
          style={styles.link}
          onPress={() => router.push('/create-service')}
        >
          <Text style={styles.link}>＋ Adicionar Serviço</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}
