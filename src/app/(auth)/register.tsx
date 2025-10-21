import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/src/schema/register.schema';
import type { Register } from '@/src/types/register.types';


export default function Register() {
  const { control, handleSubmit, formState: {
      errors
    } } = useForm<Register>({
      resolver: zodResolver(registerSchema),
    })
  
    const submit = async (data: Register) => {
      console.log(data)
    }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CADASTRO</Text>
      <Text>Nome:</Text>
      <Controller 
        control={control} 
        name='username' 
        render={({ field }) => (
        <TextInput style={styles.input} { ...field } />
      )}/>
      {errors.username && <Text>{errors.username.message}</Text>}
      
      <Text>Email:</Text>
      <Controller 
        control={control} 
        name='email' 
        render={({ field }) => (
        <TextInput style={styles.input} { ...field } keyboardType="email-address" />
      )}/>
      {errors.email && <Text>{errors.email.message}</Text>}
      
      <Text>Senha:</Text>
      <Controller 
        control={control}
        name='password' 
        render={({ field }) => (
        <TextInput style={styles.input} { ...field } secureTextEntry />
      )}/>
      {errors.password && <Text>{errors.password.message}</Text>}
           

      <TouchableOpacity onPress={handleSubmit(submit)}>
        <Text style={styles.link}>Cadastrar</Text>
      </TouchableOpacity>
    </View>

  );
}
