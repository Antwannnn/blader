"use client";

import { SessionProvider } from 'next-auth/react'

type ProviderProps = {
    children: React.ReactNode
    session?: any
}

const Provider = ({children, session}: ProviderProps) => {
  return (
    <SessionProvider session={session}>
        {children}
    </SessionProvider>
  )
}

export default Provider