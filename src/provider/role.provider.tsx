import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useEffect, useState } from 'react'
import { ROLE } from '../constants/roles'
import type { Provider } from '../types/provider.types'

type Role = (typeof ROLE)[keyof typeof ROLE]

interface RoleContextValue {
  role: Role
  setRole: (role: Role) => void
}

export const RoleContext = createContext<RoleContextValue | undefined>(
  undefined
)

export function RoleProvider({ children }: Provider) {
  const [role, setRoleState] = useState<Role>(ROLE.USER)

  useEffect(() => {
    AsyncStorage.getItem('role').then(storedRole => {
      if (storedRole === ROLE.USER || storedRole === ROLE.ADMIN) {
        setRole(storedRole)
      }
    })
  }, [])

  const setRole = (newRole: Role) => {
    setRoleState(newRole)
    AsyncStorage.setItem('role', newRole)
  }

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  )
}
