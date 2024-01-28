"use client";

import { useState, useEffect } from 'react';
import { ElementLoader } from '@components/subcomponents/Loader';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LiteralUnion } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers/index';
import { ClientSafeProvider } from 'next-auth/react';
import { signIn, getProviders } from 'next-auth/react';
import ErrorBlock from '@components/subcomponents/ErrorBlock';
import { FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';


const Signup = () => {

  const [error, setError] = useState<string | null>(null);

  async function isUsernameAvailable(username: string) {
    const res = await fetch(`/api/user/${username}`);
    const data = await res.json();
    if (res.status === 404) {
      setUsernameAvailable('available');
    } else {
      setUsernameAvailable('unavailable');
    }
  }


  async function handleSubmit(e: FormEvent<HTMLFormElement>) {

    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!formData.get('name') || !formData.get('email') || !formData.get('password')) {
      setError('Please fill in all the fields.');
      return;
    }

    const res = await fetch('/api/auth/signup', {


      method: 'POST',
      body: JSON.stringify({ name: formData.get('name'), email: formData.get('email'), password: formData.get('password') }),
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    const response = await res.json();

    if (response?.success) {
      const signInRes = await signIn('credentials', { email: formData.get('email'), password: formData.get('password'), redirect: false });
      if (signInRes?.error) {
        setError(signInRes.error);
        return;
      }
    } else {
      setError(response?.error);
      return;
    }

  }

  const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null);

  const { data: session, status } = useSession();
  const [username, setUsername] = useState<string>();
  const [usernameAvailable, setUsernameAvailable] = useState<string>('unset');
  const router = useRouter();

  useEffect(() => {

    isUsernameAvailable(username!);

    if (session) {
      router.push('/');
    }
    const setUpProviders = async () => {
      const resp = await getProviders();
      setProviders(resp);
    };
    setUpProviders();
  }, [providers, session, username]);

  return (

    <section

      className="flex flex-col h-screen justify-center gap-5 py-24 items-center ">

      <div className="hero w-4/6 sm:w-96 flex flex-col items-center justify-center text-center">
        <h1 className="overflow-hidden font-bold text-4xl py-4 text-secondary_light">Sign-up</h1>
        <form className='w-full' onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 grid-rows-5 flex-col items-center justify-center gap-3">
            <ErrorBlock error={error} className='text-red-500' />
            <div className='text-secondary_light flex items-center text-sm outline-none bg-secondary_dark rounded-full w-full placeholder:opacity-50'><input  className='account-related-form-input' placeholder='Username' name='name' type="text" />  </div>
            <input placeholder='Email' type="text" name='email' className="account-related-form-input" />
            <input placeholder='Password' type="password" name='password' className="account-related-form-input" />
            <button type='submit' className="w-full rounded-full py-2 button-primary-dark">Sign-up</button>
            {providers ? (<button type='button' onClick={() => { signIn('google', { callbackUrl: '/' }) }} className='w-full rounded-full flex justify-center gap-4 py-3 button-primary-dark'><p>Continue with Google</p> <Image width="24" height="24" alt={`google logo`} src={`/assets/svgs/providers/google.svg`} /></button>) : (<ElementLoader className='flex flex-col items-center justify-center gap-5' />)}
            <Link href="/auth/login" className='text-tertiary_light opacity-60  underline underline-offset-4 hover:opacity-100 duration-200 transition'>Already have an account ?</Link>
          </div>
        </form>
      </div>
    </section>
  )
}

export default Signup;