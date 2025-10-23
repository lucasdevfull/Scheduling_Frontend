import { useLoginMutation } from '@/src/hooks/use-login-mutation'
import { useLoginForm } from '@/src/hooks/use-login-form'
import type { Login } from '@/src/types/login.types'
import React from 'react'
import { Controller } from 'react-hook-form'
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { styles } from '../styles'

export default function Login() {
  const { control, errors, handleSubmit } = useLoginForm()
  const { mutateAsync, error, isPending } = useLoginMutation()
  const submit = async (data: Login) => {
    try {
      await mutateAsync(data)
    } catch (err: any) {
      Alert.alert('Error', err.message)
    }
    if (error) {
      Alert.alert('Error', error.message)
    }
  }
  return (
    <View style={styles.container}>
      {<Text></Text>}
      <Text style={styles.title}>LOGIN</Text>
      <Text>Email:</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />
      {errors.email && <Text>{errors.email.message}</Text>}

      <Text>Senha:</Text>
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            secureTextEntry
          />
        )}
      />
      {errors.password && <Text>{errors.password.message}</Text>}
      {/* <TextInput style={styles.input} secureTextEntry /> */}
      <TouchableOpacity onPress={handleSubmit(submit)}>
        <Text style={styles.link} disabled={isPending}>Login</Text>
      </TouchableOpacity>
    </View>
  )
}
