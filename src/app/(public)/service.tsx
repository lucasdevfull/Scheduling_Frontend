import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { styles } from '../styles'; // ✅ importando o mesmo styles.ts do login/register

export default function ServicePage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ newService?: string }>();
  const [services, setServices] = useState<any[]>([]);

  React.useEffect(() => {
    if (params?.newService) {
      const parsed = JSON.parse(params.newService);
      setServices((prev) => [...prev, parsed]);
    }
  }, [params?.newService]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Serviços Cadastrados</Text>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.link}>Nenhum serviço cadastrado.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.input}> 
            {/* usando input só para reaproveitar padding/borda */}
            <Text style={styles.title}>{item.nome}</Text>
            <Text>{item.descricao}</Text>
            <Text>📅 {item.data} ⏰ {item.hora}</Text>
          </View>
        )}
        contentContainerStyle={services.length === 0 && { flexGrow: 1, justifyContent: 'center' }}
      />

      <TouchableOpacity
        style={styles.link}
        onPress={() => router.push('/createService')}
      >
        <Text style={styles.link}>＋ Adicionar Serviço</Text>
      </TouchableOpacity>
    </View>
  );
}
