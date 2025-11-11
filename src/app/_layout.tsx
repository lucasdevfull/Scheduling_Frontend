import { Stack } from 'expo-router'
import { GlobalProvider } from '../provider'

export default function Layout() {
  return (
    <GlobalProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="register" options={{ title: 'Register' }} />
        <Stack.Screen name="service" options={{ title: 'Service' }} />
        <Stack.Screen name="create-service" options={{ title: 'CreateService' }} />
        <Stack.Screen name="update-service" options={{ title: 'UpdateService' }} />
      </Stack>
    </GlobalProvider>
  )
}
