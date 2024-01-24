"use client"

import React, { useEffect, useState } from 'react';
import { getProviders } from 'next-auth/react';


const Login = () => {

  const [providers, setProviders] = useState(null);

  useEffect(() => {
    const setProviders = async (response: any) => {
      const resp = await getProviders();
      setProviders(resp);
    };
    setProviders(null);
  }, []);

  return (



    <div>Login</div>
  )
}

export default Login