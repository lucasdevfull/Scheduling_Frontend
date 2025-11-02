import { Redirect } from 'expo-router'
import { getItemAsync } from 'expo-secure-store'
import React, { useEffect, useState } from 'react'

export default function Index() {
  const [isLogged, setIsLogged] = useState<boolean>(false)
  
  useEffect(() => {
    getItemAsync('access').then(token => {
      if (token) {
        setIsLogged(true)
      }
    })
  }, [])
  return <Redirect href={isLogged ? '/(public)/service' : '/(auth)/login'} />
}
