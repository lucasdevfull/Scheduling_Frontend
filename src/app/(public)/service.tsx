import { ROLE } from '@/constants/roles'
import { useRole } from '@/hooks/use-role'
import { useRouter } from 'expo-router'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { styles } from '../../styles'
import { ServiceItem } from '@/components/service-item'
import { useListServiceViewModel } from '@/hooks/viewmodel/use-list-service-view-model'

export default function ServicePage() {
  const router = useRouter()
  const { role } = useRole()
  const { service, onDelete } = useListServiceViewModel()

  return (
    <View style={styles.container}>
      {service === undefined ? (
        <Text style={styles.title}>Nenhum serviço Cadastrado. </Text>
      ) : (
        <FlatList
          data={service.pages[0].data}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={<Text style={styles.link}>Nenhum serviço cadastrado.</Text>}
          renderItem={({ item }) => (
            <ServiceItem
              {...item}
              onDelete={onDelete}
              onPress={() =>
                router.navigate({
                  pathname: '/(public)/[id]',
                  params: { id: item.id },
                })
              }
            />
          )}
          contentContainerStyle={
            service.pages[0].data.length === 0 && { flexGrow: 1, justifyContent: 'center' }
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
