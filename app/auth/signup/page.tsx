"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LiteralUnion } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers/index';
import { ElementLoader, IconLoader } from '@components/subcomponents/Loader';
import { ClientSafeProvider } from 'next-auth/react';
import { signIn, getProviders } from 'next-auth/react';
import ErrorBlock from '@components/subcomponents/ErrorBlock';
import { FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';


const Signup = () => {

  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null);
  const { data: session, status } = useSession();
  const [username, setUsername] = useState<string>('');
  const [usernameLoading, setUsernameLoading] = useState<boolean>(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean>(false);
  const router = useRouter();


  async function isUsernameAvailable(pUsername: string) {

    setUsernameLoading(true);
    clearTimeout(timer);

    const newTimer = setTimeout(async () => {
      const res = await fetch(`/api/user/${pUsername}`);

      if (res.status === 404) {
        setUsernameAvailable(true);
      }
      else {
        setUsernameAvailable(false);
      }
      setUsernameLoading(false);
    }, 1000)

    setTimer(newTimer)
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
      console.log(signInRes);
      if (signInRes?.error) {
        setError(signInRes.error);
        return;
      }
    } else {
      setError(response?.error);
      return;
    }

  }

  useEffect(() => {

    if (session) {
      router.push('/');
    }
    const setUpProviders = async () => {
      const resp = await getProviders();
      setProviders(resp);
    };
    setUpProviders();
  }, [providers, session, usernameAvailable]);



  return (

    <section

      className="flex flex-col h-screen justify-center gap-5 py-24 items-center ">

      <div className="hero w-4/6 sm:w-96 flex flex-col items-center justify-center text-center">
        <h1 className="overflow-hidden font-bold text-4xl py-4 text-secondary_light">Sign-up</h1>
        <form className='w-full' onSubmit={handleSubmit}>
          <div className="flex flex-col items-center overflow-hidden justify-center gap-4">
            <ErrorBlock error={error} className='text-red-500' />
            <div className='text-secondary_light flex items-center text-sm outline-none bg-secondary_dark rounded-full w-full placeholder:opacity-50'>
              <input autoComplete="off" value={username} onChange={async (e) => { setUsername(e.target.value); isUsernameAvailable(e.target.value) }} className='account-related-form-input' placeholder='Username' name='name' type="text" />
              {username != '' ? (<div className='flex justify-center items-center mr-4'>
                {usernameLoading ? (<IconLoader className='flex justify-center items-center' />) : <>{usernameAvailable ? (
                  <svg fill="#86FFA8" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                    className='w-6 h-6' viewBox="0 0 335.765 335.765">
                    <g>
                      <g>
                        <polygon points="311.757,41.803 107.573,245.96 23.986,162.364 0,186.393 107.573,293.962 335.765,65.795 		" />
                      </g>
                    </g>
                  </svg>) : (<svg fill="#FF8686" className='w-6 h-6' viewBox="0 0 200 200" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"><title /><path d="M114,100l49-49a9.9,9.9,0,0,0-14-14L100,86,51,37A9.9,9.9,0,0,0,37,51l49,49L37,149a9.9,9.9,0,0,0,14,14l49-49,49,49a9.9,9.9,0,0,0,14-14Z" /></svg>)}</>}

              </div>) : (<></>)}
            </div>
            <div className='text-secondary_light flex items-center text-sm outline-none bg-secondary_dark rounded-full w-full placeholder:opacity-50'>
              <input autoComplete="off" placeholder='Email' type="text" name='email' className="account-related-form-input" />
            </div>
            <input placeholder='Password' type="password" name='password' className="account-related-form-input" />
            {(usernameAvailable && username) ? (<button type='submit' className="w-full rounded-full py-2 button-primary-dark">Sign-up</button>) : (<button disabled type='submit' className="w-full rounded-full py-2 button-primary-dark-disabled">Sign-up</button>)}
            {providers ? (
              <div className='flex flex-col m-2 gap-3 w-full'>
                <button type='button' onClick={() => { signIn('google', { callbackUrl: '/' }) }} className='w-full rounded-full flex justify-center gap-4 py-3 button-primary-dark'>
                  <p>Continue with Google</p>
                  <Image width="24" height="24" alt={`google logo`} src={`/assets/svgs/providers/google.svg`} />
                </button>
                <button type='button' onClick={() => { signIn('discord', { callbackUrl: '/' }) }} className='w-full rounded-full flex justify-center gap-4 py-3 button-primary-dark'>
                  <p>Continue with Discord</p>
                  <Image width="24" height="24" alt={`google logo`} src={`/assets/svgs/providers/discord.svg`} />
                </button>
              </div>
            ) : (<ElementLoader className='flex flex-col items-center justify-center gap-5' />
            )}
            <Link href="/auth/login" className='text-tertiary_light opacity-60  underline underline-offset-4 hover:opacity-100 duration-200 transition'>Already have an account ?</Link>
          </div>
        </form>
      </div>
    </section>
  )
}

export default Signup;