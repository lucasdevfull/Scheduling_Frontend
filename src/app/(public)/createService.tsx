import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '../styles'; // ✅ importando o mesmo styles.ts

export default function CreateService() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');

  const handleSave = () => {
    if (!nome || !descricao || !data || !hora) {
      alert('Preencha todos os campos!');
      return;
    }

    const dataRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    const horaRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!dataRegex.test(data)) {
      alert('Data inválida! Use o formato DD/MM/AAAA.');
      return;
    }
    if (!horaRegex.test(hora)) {
      alert('Horário inválido! Use o formato HH:MM.');
      return;
    }

    const novoServico = {
      id: Date.now().toString(),
      nome,
      descricao,
      data,
      hora,
    };

    router.push({
      pathname: '/service',
      params: { newService: JSON.stringify(novoServico) },
    });
  };

  const handleChangeData = (text: string) => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 2 && cleaned.length <= 4) {
      cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    } else if (cleaned.length > 4) {
      cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
    }
    setData(cleaned);
  };

  const handleChangeHora = (text: string) => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 2) {
      cleaned = cleaned.slice(0, 2) + ':' + cleaned.slice(2, 4);
    }
    setHora(cleaned);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Serviço</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do serviço"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Descrição do serviço"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Data (DD/MM/AAAA)"
        value={data}
        onChangeText={handleChangeData}
        keyboardType="numeric"
        maxLength={10}
      />

      <TextInput
        style={styles.input}
        placeholder="Horário (HH:MM)"
        value={hora}
        onChangeText={handleChangeHora}
        keyboardType="numeric"
        maxLength={5}
      />

      <TouchableOpacity style={styles.link} onPress={handleSave}>
        <Text style={styles.link}>Salvar Serviço</Text>
      </TouchableOpacity>
    </View>
  );
}
