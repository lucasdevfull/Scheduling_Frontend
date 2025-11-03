import { useLoginForm } from '@/hooks/mutation/use-login-form'
import { useLoginMutation } from '@/hooks/mutation/use-login-mutation'
import type { Login } from '@/types/login.types'
import { Controller } from 'react-hook-form'
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { styles } from '../styles'
import { Link } from 'expo-router'

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
      <Link href={'/(auth)/register'}>
        <Text>Não possui conta? Cadastre-se!</Text>
      </Link>
      <TouchableOpacity onPress={handleSubmit(submit)}>
        <Text style={styles.link} disabled={isPending}>
          Login
        </Text>
      </TouchableOpacity>
    </View>
  )
}
