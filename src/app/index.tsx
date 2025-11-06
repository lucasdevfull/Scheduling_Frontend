import { getToken } from '@/utils/token'
import { Redirect } from 'expo-router'
import React, { useEffect, useState } from 'react'

export default function Index() {
  const [isLogged, setIsLogged] = useState<boolean>(false)

  useEffect(() => {
    getToken('access').then(token => {
      if (token) {
        setIsLogged(true)
      }
    })
  }, [])
  return <Redirect href={isLogged ? '/(public)/service' : '/(auth)/login'} />
}
