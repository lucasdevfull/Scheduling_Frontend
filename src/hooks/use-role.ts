import { useContext } from 'react'
import { RoleContext } from '../provider/role.provider'

export function useRole() {
  const context = useContext(RoleContext)
  if (!context) throw new Error('useRole deve ser usado dentro de um RoleProvider')
  return context
}
