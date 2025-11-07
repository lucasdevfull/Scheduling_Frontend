import { Provider } from '@/types/provider.types'
import { QueryProvider } from './query.provider'
import { RoleProvider } from './role.provider'

export function GlobalProvider({ children }: Provider) {
  return (
    <QueryProvider>
      <RoleProvider>{children}</RoleProvider>
    </QueryProvider>
  )
}
