import { useLoginViewModel } from '@/hooks/viewmodel/use-login-view-model'
import { Link } from 'expo-router'
import { Controller } from 'react-hook-form'
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
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

      <Link href={'/(auth)/register'}>
        <Text>Não possui conta? Cadastre-se!</Text>
      </Link>

      {/* botão compacto */}
      <TouchableOpacity
        style={localStyles.smallButton}
        disabled={isPending}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={localStyles.smallButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  )
}

const localStyles = StyleSheet.create({
  smallButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 15,
  },
  smallButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
})
