import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/src/schema/login.schema';
import type { Login } from '@/src/types/login.types';


export default function Login() {
  const { control, handleSubmit, formState: {
    errors
  } } = useForm<Login>({
    resolver: zodResolver(loginSchema),
  })

  const submit = async (data: Login) => {
    console.log(data)
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LOGIN</Text>
      <Text>Usuário:</Text>
      <Controller 
        control={control} 
        name='username' 
        render={({ field }) => (
        <TextInput style={styles.input} { ...field } />
      )}/>
      {errors.username && <Text>{errors.username.message}</Text>}

      <Text>Senha:</Text>
      <Controller 
        control={control}
        name='password' 
        render={({ field }) => (
        <TextInput style={styles.input} { ...field } secureTextEntry />
      )}/>
      {errors.password && <Text>{errors.password.message}</Text>}
      {/* <TextInput style={styles.input} secureTextEntry /> */}
      <TouchableOpacity onPress={handleSubmit(submit)}>
        <Text style={styles.link}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}


