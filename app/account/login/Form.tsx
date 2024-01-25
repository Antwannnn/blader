"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ElementLoader } from '@components/subcomponents/Loader';
import { signIn, getProviders } from 'next-auth/react';
import { FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import { LiteralUnion } from 'next-auth/react';
import { ClientSafeProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import { BuiltInProviderType }  from 'next-auth/providers/index';

const Form = () => {
    const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null);

  const {data: session, status} = useSession();
  const [isLoading , setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
  
    try {
      const s = signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        callbackUrl: '/'
      });

      console.log(s);

    } catch (error) {
      console.error('Sign In Error:', error);
    }
  }

  useEffect(() => {

    if(session){
      router.push('/');
    }
    const setUpProviders = async () => {
      const resp = await getProviders();
      setProviders(resp);
      setIsLoading(false);
    };
    setUpProviders();
  }, [providers, session]);

  return (
    <section

      className="flex flex-col h-screen justify-center gap-3 py-24 items-center ">

      <div className="hero w-4/6 sm:w-96 flex flex-col items-center justify-center text-center">
        <h1 className="overflow-hidden font-bold text-4xl py-4 text-secondary_light">Login</h1>
        <form className='w-full' onSubmit={handleSubmit}>
          <div className=" flex flex-col items-center justify-center gap-5">
            <input placeholder='Email' name='email' type="email" className="text-secondary_light flex items-center text-sm outline-none bg-secondary_dark rounded-full px-6 py-3 w-full placeholder:opacity-50" />
            <input placeholder='Password' name='password' type="password" className="text-secondary_light flex items-center text-sm outline-none bg-secondary_dark rounded-full px-6 py-3 w-full  placeholder:opacity-50" />
            <button type='submit' className="w-full rounded-full py-2 button-primary-dark">Login</button>
            {!isLoading ? (<button type='button' onClick={() => {signIn('google', {callbackUrl: '/'})}}  className='w-full rounded-full flex justify-center gap-4 py-3 button-primary-dark'><p>Continue with Google</p> <Image width="24" height="24" alt={`google logo`} src={`/assets/svgs/providers/google.svg`} /></button>): (<ElementLoader className='flex flex-col items-center justify-center gap-5' />)}          </div>
        </form>
      </div>
      </section>
  )
}

export default Form