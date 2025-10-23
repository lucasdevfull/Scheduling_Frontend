import { Redirect } from 'expo-router'
import React from 'react'

export default function Index() {
  const isLogged = true
  return <Redirect href={isLogged ? '/(auth)/login' : '/(auth)/register'} />
}
