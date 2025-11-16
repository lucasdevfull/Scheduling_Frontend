import { ROLE } from '@/constants/roles'
import { useRole } from '@/hooks/use-role'
import { useRouter } from 'expo-router'
import { FlatList, Platform, Pressable, Text, TouchableOpacity, View, StyleSheet, Modal } from 'react-native'
import { styles } from '../../styles'
import { ServiceItem } from '@/components/service-item'
import { useListServiceViewModel } from '@/hooks/viewmodel/use-list-service-view-model'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'

export default function ServicePage() {
  const router = useRouter()
  const { role } = useRole()
  const { service, onDelete } = useListServiceViewModel()
  const [profileVisible, setProfileVisible] = useState(false)

  const logout = async () => {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem('access')
      await AsyncStorage.removeItem('refresh')
    }
    await AsyncStorage.removeItem('role')
    router.navigate('/(auth)/login')
  }

  return (
    <View style={styles.container}>
      
      {/* Cabeçalho */}
      <View style={localStyles.header}>
        <Text style={localStyles.headerTitle}>Serviços Cadastrados</Text>
      </View>

      {/* Logout (NÃO ALTERADO) */}
      <Pressable style={localStyles.logoutButton} onPress={logout}>
        <Text style={localStyles.logoutText}>Logout</Text>
      </Pressable>

      {/* LISTA OU TELA VAZIA */}
      {service === undefined || service.pages[0].data.length === 0 ? (
        <View style={localStyles.emptyContainer}>
          <Text style={styles.title}>Nenhum serviço cadastrado.</Text>
        </View>
      ) : (
        <FlatList
          data={service.pages[0].data}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <ServiceItem
              {...item}
              role={role}
              onDelete={onDelete}
              onPress={() => {
                if (role === ROLE.ADMIN) {
                  router.navigate({
                    pathname: '/(public)/[id]',
                    params: { id: item.id },
                  })
                }
              }}
            />
          )}
        />
      )}

      {/* Botão de adicionar serviço */}
      <TouchableOpacity style={localStyles.smallButton} onPress={() => router.push('/create-service')}>
        <Text style={localStyles.smallButtonText}>＋ Adicionar Serviço</Text>
      </TouchableOpacity>

      {/* Ícone de perfil */}
      <TouchableOpacity style={localStyles.profileIcon} onPress={() => setProfileVisible(true)}>
        <Ionicons name="person-circle-outline" size={42} color="#333" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={profileVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setProfileVisible(false)}
      >
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalBox}>
            <Text style={localStyles.modalTitle}>Informações do Chaveiro</Text>

            <Text style={localStyles.infoText}>🔑 Nome: André Alex Nascimento De Oliveira</Text>
            <Text style={localStyles.infoText}>📍 Localização: Campo Grande, RJ</Text>
            <Text style={localStyles.infoText}>📞 Telefone: (21) 96452-2366</Text>
            <Text style={localStyles.infoText}>🌐 Email: andre_chaveiro@hotmail.com</Text>
            <Text style={localStyles.infoText}>🕒 Horário: 08h às 18h</Text>
            <Text style={localStyles.infoText}>🔧 Especialidade: Chaves automotivas e residenciais</Text>

            <TouchableOpacity style={localStyles.closeButton} onPress={() => setProfileVisible(false)}>
              <Text style={localStyles.closeText}>Fechar</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </View>
  )
}

const localStyles = StyleSheet.create({
  header: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222',
  },

  /* CONTAINER DO TEXTO VAZIO CENTRALIZADO */
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  smallButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 20,
  },
  smallButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  logoutButton: {
    backgroundColor: '#E53935',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },

  profileIcon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#1976D2',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
})
