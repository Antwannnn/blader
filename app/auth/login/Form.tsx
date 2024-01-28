"use client"

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ElementLoader } from '@components/subcomponents/Loader';
import { signIn, getProviders } from 'next-auth/react';
import { FormEvent } from 'react';
import { LiteralUnion } from 'next-auth/react';
import { ClientSafeProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import ErrorBlock from '@components/subcomponents/ErrorBlock';
import { BuiltInProviderType } from 'next-auth/providers/index';
import Link from 'next/link';


const Form = () => {
    const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const loginData = new FormData(e.currentTarget);
        if (!loginData.get('email') || !loginData.get('password')) {
            setError('Please fill in all the fields')
            return;
        };

        const response = await signIn("credentials",
            {
                email: loginData.get('email') as string,
                password: loginData.get('password') as string,
                redirect: false,
            });
        if (response?.ok) {
            router.push('/');
        } else {
            setError(response?.status === 401 ? 'Incorrect email or password' : 'Something went wrong');
        }

        console.log(response);
    }

    async function handleGoogleLogin() {
        signIn('google', { callbackUrl: '/' });
    }

    useEffect(() => {

        const setUpProviders = async () => {
            const resp = await getProviders();
            setProviders(resp);
            setIsLoading(false);
        };
        setUpProviders();
    }, [providers]);

    return (
        <section

            className="flex flex-col h-screen justify-center gap-3 py-24 items-center ">

            <div className="hero w-4/6 sm:w-96 flex flex-col items-center justify-center text-center">
                <h1 className="overflow-hidden font-bold text-4xl py-4 text-secondary_light">Login</h1>
                <form className='w-full' onSubmit={handleSubmit}>
                    <div className=" flex flex-col items-center justify-center gap-5">
                        <ErrorBlock error={error} className='shadow-sm text-red-500 px-3 py-1 rounded-xl relative' />
                        <input autoComplete='email' id="email" placeholder='Email' name='email' type="email" className="text-secondary_light flex items-center text-sm outline-none bg-secondary_dark rounded-full px-6 py-3 w-full placeholder:opacity-50" />
                        <input autoComplete='password' id="password" placeholder='Password' name='password' type="password" className="text-secondary_light flex items-center text-sm outline-none bg-secondary_dark rounded-full px-6 py-3 w-full  placeholder:opacity-50" />
                        <button type='submit' className="w-full rounded-full py-2 button-primary-dark">Login</button>
                        {!isLoading ? (<button type='button' onClick={handleGoogleLogin} className='w-full rounded-full flex justify-center gap-4 py-3 button-primary-dark'><p>Continue with Google</p> <Image width="24" height="24" alt={`google logo`} src={`/assets/svgs/providers/google.svg`} /></button>) : (<ElementLoader className='flex flex-col items-center justify-center gap-5' />)}
                        <Link href="/auth/signup" className='text-tertiary_light opacity-60  underline underline-offset-4 hover:opacity-100 duration-200 transition'>Don't have an account ?</Link>
                    </div>
                </form>
            </div>
        </section>

    )
}

export default Form