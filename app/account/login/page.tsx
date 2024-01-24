"use client"

import React, { useEffect, useState } from 'react';
import { getProviders } from 'next-auth/react';
import { LiteralUnion } from 'next-auth/react';
import { ClientSafeProvider } from 'next-auth/react';
import { BuiltInProviderType }  from 'next-auth/providers';


const Login = () => {

  const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null);

  useEffect(() => {
    const setUpProviders = async () => {
      const resp = await getProviders();
      setProviders(resp);
    };
    setUpProviders();
  }, []);

  return (



    <div>Login</div>
  )
}

export default Login