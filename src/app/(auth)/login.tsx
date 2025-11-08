import { useLoginViewModel } from '@/hooks/viewmodel/use-login-view-model'
import { Link } from 'expo-router'
import { Controller } from 'react-hook-form'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { styles } from '../../styles'

export default function Login() {
  const { control, errors, handleSubmit, onSubmit, isPending } = useLoginViewModel()
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
      <TouchableOpacity onPress={handleSubmit(onSubmit)}>
        <Text style={styles.link} disabled={isPending}>
          Login
        </Text>
      </TouchableOpacity>
    </View>
  )
}
