import AsyncStorage from '@react-native-async-storage/async-storage'
import { getItemAsync } from 'expo-secure-store'
import { Platform } from 'react-native'

export async function getToken(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return AsyncStorage.getItem(key)
  }
  return getItemAsync(key)
}
