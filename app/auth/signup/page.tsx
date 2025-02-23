"use client";

import ErrorBlock from '@components/subcomponents/ErrorBlock';
import { ElementLoader, IconLoader } from '@components/subcomponents/Loader';
import { FaDiscord, FaGoogle } from '@node_modules/react-icons/fa';
import { BuiltInProviderType } from 'next-auth/providers/index';
import { ClientSafeProvider, getProviders, LiteralUnion, signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';


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
    <section className="flex flex-col min-h-screen justify-center gap-5 py-24 items-center bg-background">
      <div className="w-4/6 sm:w-96 flex flex-col items-center justify-center text-center">
        <h1 className="font-bold text-4xl py-4 text-text">Sign-up</h1>
        <form className='w-full' onSubmit={handleSubmit}>
          <div className="flex flex-col items-center justify-center gap-4">
            <ErrorBlock error={error} className='text-accent' />
            
            {/* Username Input */}
            <div className='flex items-center text-sm bg-secondary rounded-full w-full'>
              <input 
                autoComplete="off"
                aria-autocomplete="none"
                id='username'
                value={username} 
                onChange={async (e) => { 
                  setUsername(e.target.value); 
                  isUsernameAvailable(e.target.value) 
                }} 
                className='w-full px-6 py-3 bg-secondary text-text outline-none autofill:bg-secondary rounded-full placeholder:text-text/80'
                placeholder='Username' 
                name='name' 
                type="text" 
              />
              {username && (
                <div className='flex justify-center items-center mr-4'>
                  {usernameLoading ? (
                    <IconLoader className='w-6 h-6' />
                  ) : (
                    usernameAvailable ? (
                      <svg fill="#86FFA8" version="1.1" xmlns="http://www.w3.org/2000/svg"
                        className='w-6 h-6' viewBox="0 0 335.765 335.765">
                        <polygon points="311.757,41.803 107.573,245.96 23.986,162.364 0,186.393 107.573,293.962 335.765,65.795" />
                      </svg>
                    ) : (
                      <svg fill="#FF8686" className='w-6 h-6' viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path d="M114,100l49-49a9.9,9.9,0,0,0-14-14L100,86,51,37A9.9,9.9,0,0,0,37,51l49,49L37,149a9.9,9.9,0,0,0,14,14l49-49,49,49a9.9,9.9,0,0,0,14-14Z" />
                      </svg>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Email Input */}
            <div className='flex items-center text-sm bg-theme-secondary rounded-full w-full'>
              <input 
                autoComplete="new-password"
                aria-autocomplete="none"
                placeholder='Email' 
                type="email" 
                name='email' 
                className='w-full px-6 py-3 bg-secondary text-text outline-none autofill:bg-secondary rounded-full placeholder:text-text/80'
              />
            </div>

            {/* Password Input */}
            <div className='flex items-center text-sm bg-theme-secondary rounded-full w-full'>
              <input 
                autoComplete="new-password"
                aria-autocomplete="none"
                placeholder='Password' 
                type="password" 
                name='password' 
                className='w-full px-6 py-3 bg-secondary text-text outline-none autofill:bg-secondary rounded-full placeholder:text-text/80'
              />
            </div>

            {/* Submit Button */}
            <button 
              type='submit' 
              disabled={!usernameAvailable || !username}
              className={`w-full rounded-full py-3 transition duration-200 text-text bg-secondary ${
                usernameAvailable && username 
                  ? 'hover:bg-tertiary' 
                  : 'cursor-not-allowed opacity-50'
              }`}
            >
              Sign-up
            </button>

            {/* OAuth Providers */}
            {providers ? (
              <div className='flex flex-col m-2 gap-3 w-full'>
                <button 
                  type='button' 
                  onClick={() => signIn('google', { callbackUrl: '/' })} 
                  className='w-full rounded-full  flex justify-center items-center gap-4 py-3 bg-secondary hover:bg-tertiary text-text transition duration-200'
                >
                  <p>Continue with Google</p>
                  <FaGoogle className='w-5 h-5' />
                </button>
                <button 
                  type='button' 
                  onClick={() => signIn('discord', { callbackUrl: '/' })} 
                  className='w-full rounded-full flex justify-center items-center gap-4 py-3 bg-secondary hover:bg-tertiary text-text transition duration-200'
                >
                  <p>Continue with Discord</p>
                  <FaDiscord className='w-5 h-5' />
                </button>
              </div>
            ) : (
              <ElementLoader className='flex flex-col items-center justify-center gap-5' />
            )}

            {/* Login Link */}
            <Link 
              href="/auth/login" 
              className='text-text opacity-60 hover:opacity-100 transition duration-200 underline underline-offset-4'
            >
              Already have an account?
            </Link>
          </div>
        </form>
      </div>
    </section>
  )
}

export default Signup;