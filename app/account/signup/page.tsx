"use client";

import { useState, useEffect } from 'react';
import { ElementLoader }from '@components/subcomponents/Loader';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LiteralUnion } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers/index';
import { ClientSafeProvider } from 'next-auth/react';
import { signIn, getProviders } from 'next-auth/react';
import Image from 'next/image';


const Signup = () => {

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
        <form className='w-full' action="">
          <div className="grid grid-cols-2 grid-rows-6 sm:grid-rows-5 flex-col items-center justify-center gap-3">
            <input placeholder='Surname' name='' type="text" className='account-related-form-input col-span-2 sm:col-span-1' />
            <input placeholder='Name' type="text" className='account-related-form-input col-span-2 sm:col-span-1' />
            <input placeholder='Email' type="text" className="account-related-form-input col-span-2" />
            <input placeholder='Password' type="password" className="account-related-form-input col-span-2" />
            <button className="w-full rounded-full py-2 button-primary-dark col-span-2">Sign-up</button>
            {providers ? (Object.values(providers).map((provider) => (<button type='button' onClick={() => {signIn(provider.id, {callbackUrl: '/'})}} key={provider.name} className='w-full rounded-full flex justify-center gap-4 py-3 col-span-2 button-primary-dark'><p>Continue with {provider.name}</p> <Image width="24" height="24" alt={`${provider.name}' logo`} src={`/assets/svgs/providers/${provider.name.toLowerCase()}.svg`} /></button>))): (<ElementLoader className='flex col-span-2 flex-col items-center justify-center gap-5' />)}
          </div>
        </form>
      </div> 
      </section>
  )
}

export default Signup