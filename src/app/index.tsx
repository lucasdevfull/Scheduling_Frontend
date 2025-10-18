import React, { useState } from 'react';
import { View, Text, TextInput, Button, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  name: z.string().min(2, "O nome deve ter ao menos 2 caracteres"),
  birthDate: z.date(),
});

type FormData = z.infer<typeof formSchema>;

export default function FormScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      birthDate: new Date()
    },
  });

  // Estado para controlar se o DatePicker aparece ou não
  const [showBirthPicker, setShowBirthPicker] = useState(false);

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Nome</Text>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <>
          <TextInput
            value={value}
            onChangeText={onChange}
            style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          />
           {errors.name && <Text style={{ color: "red" }}>{errors.name.message}</Text>}
          </>
        )}
      />

      <Text>Data de Nascimento</Text>
      <Controller
        control={control}
        name="birthDate"
        render={({ field: { value, onChange } }) => (
          <View>
            {/* Botão para abrir o picker */}
            <TextInput
            style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
              //title={value.toLocaleDateString()}
              onPress={() => setShowBirthPicker(true)}
            
            >{value ? value.toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                }): 'Selecione uma data'}</TextInput>

            {/* DatePicker só aparece quando showBirthPicker é true */}
            {showBirthPicker && (
              <DateTimePicker
                value={value}
                mode="date"
                display="default"
                onChange={(_, selectedDate) => {
                  setShowBirthPicker(false); // fecha o picker
                  if (selectedDate) onChange(selectedDate);
                }}
              />
            )}
          </View>
        )}
      />

      <Button title="Enviar" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
