import { useRegisterForm } from "@/hooks/mutation/use-register-form";
import { useRegisterMutation } from "@/hooks/mutation/use-register-mutation";
import type { Register } from "@/types/register.types";
import { Link } from "expo-router";
import { Controller } from "react-hook-form";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../styles";

export default function Register() {
  const { mutateAsync, error, isPending } = useRegisterMutation();
  const { control, handleSubmit, errors } = useRegisterForm();

  const submit = async (data: Register) => {
    try {
      await mutateAsync(data);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
    if (error) {
      Alert.alert("Error", error.message);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CADASTRO</Text>
      <Text>Nome:</Text>
      <Controller
        control={control}
        name="username"
        render={({ field }) => <TextInput style={styles.input} {...field} />}
      />
      {errors.username && <Text>{errors.username.message}</Text>}

      <Text>Email:</Text>
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <TextInput
            style={styles.input}
            {...field}
            keyboardType="email-address"
          />
        )}
      />
      {errors.email && <Text>{errors.email.message}</Text>}

      <Text>Senha:</Text>
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <TextInput style={styles.input} {...field} secureTextEntry />
        )}
      />
      {errors.password && <Text>{errors.password.message}</Text>}
      <Link href={"/(auth)/login"}>
        <Text>Já possui conta?</Text>
      </Link>
      <TouchableOpacity disabled={isPending} onPress={handleSubmit(submit)}>
        <Text style={styles.link}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}
