import { useRegisterViewModel } from '@/hooks/viewmodel/use-register-view-model'
import { Link } from 'expo-router'
import { Controller } from 'react-hook-form'
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import { styles } from '../../styles'

export default function Register() {
  const { control, errors, handleSubmit, onSubmit, isPending } = useRegisterViewModel()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CADASTRO</Text>

      <Text>Nome:</Text>
      <Controller
        control={control}
        name="name"
        render={({ field: { value, onBlur, onChange } }) => (
          <TextInput style={styles.input} value={value} onBlur={onBlur} onChangeText={onChange} />
        )}
      />
      {errors.name && <Text>{errors.name.message}</Text>}

      <Text>Email:</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { value, onBlur, onChange } }) => (
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
        render={({ field: { value, onBlur, onChange } }) => (
          <TextInput
            style={styles.input}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            secureTextEntry
          />
        )}
      />

      <Text>Confirmar senha:</Text>
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { value, onBlur, onChange } }) => (
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

      <Link href={'/(auth)/login'}>
        <Text>Já possui conta?</Text>
      </Link>

      {/* botão compacto */}
      <TouchableOpacity
        style={localStyles.smallButton}
        disabled={isPending}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={localStyles.smallButtonText}>Cadastrar</Text>
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
