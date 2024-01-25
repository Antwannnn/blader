"use client";

import { useState, useEffect } from 'react';
import { ElementLoader }from '@components/subcomponents/Loader';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LiteralUnion } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers/index';
import { ClientSafeProvider } from 'next-auth/react';
import { signIn,  getProviders } from 'next-auth/react';
import { FormEvent } from 'react';
import Image from 'next/image';


const Signup = () => {

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {

    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch('/api/auth/signup',{
      
      method: 'POST',
      body: JSON.stringify({name: formData.get('name'), email: formData.get('email'), password: formData.get('password')}),
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if(res.ok){
      signIn('credentials', {email: formData.get('email'), password: formData.get('password'), callbackUrl: '/'});
    }

}

  const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null);

  const {data: session, status} = useSession();
  const router = useRouter();

  useEffect(() => {

    if(session){
      router.push('/');
    }
    const setUpProviders = async () => {
      const resp = await getProviders();
      setProviders(resp);
    };
    setUpProviders();
  }, [providers, session]);

  return (
  
    <section

      className="flex flex-col h-screen justify-center gap-5 py-24 items-center ">

      <div className="hero w-4/6 sm:w-96 flex flex-col items-center justify-center text-center">
        <h1 className="overflow-hidden font-bold text-4xl py-4 text-secondary_light">Sign-up</h1>
        <form className='w-full' onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 grid-rows-5 flex-col items-center justify-center gap-3">
            <input placeholder='Username' name='name' type="text" className='account-related-form-input ' />
            <input placeholder='Email' type="text" name='email' className="account-related-form-input" />
            <input placeholder='Password' type="password" name='password' className="account-related-form-input" />
            <button type='submit' className="w-full rounded-full py-2 button-primary-dark">Sign-up</button>
            {providers ? (<button type='button' onClick={() => {signIn('google', {callbackUrl: '/'})}}  className='w-full rounded-full flex justify-center gap-4 py-3 button-primary-dark'><p>Continue with Google</p> <Image width="24" height="24" alt={`google logo`} src={`/assets/svgs/providers/google.svg`} /></button>): (<ElementLoader className='flex flex-col items-center justify-center gap-5' />)}
          </div>
        </form>
      </div> 
      </section>
  )
}

export default Signup;