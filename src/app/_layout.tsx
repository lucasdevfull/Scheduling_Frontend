import { Stack } from "expo-router";
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // cache fresh por 5 minutos
      //cacheTime: 1000 * 60 * 60, // cache expira em 1 hora se não usado
    },
  },
});

// Cria o persister usando AsyncStorage
const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

export default function Layout() {
  return (
  <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
    <Stack />
  </PersistQueryClientProvider>
);
}