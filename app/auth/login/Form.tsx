"use client"

import ErrorBlock from '@components/subcomponents/ErrorBlock';
import { ElementLoader } from '@components/subcomponents/Loader';
import { BuiltInProviderType } from 'next-auth/providers/index';
import { ClientSafeProvider, getProviders, LiteralUnion, signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { FaDiscord, FaGoogle } from 'react-icons/fa';

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


    useEffect(() => {
        const setUpProviders = async () => {
            const resp = await getProviders();
            setProviders(resp);
            setIsLoading(false);
        };
        setUpProviders();
    }, []);

    return (
        <section

            className="flex flex-col h-screen justify-center gap-3 py-24 items-center ">

            <div className="hero w-4/6 sm:w-96 flex flex-col items-center justify-center text-center">
                <h1 className="overflow-hidden font-bold text-4xl py-4 text-text">Login</h1>
                <form className='w-full' onSubmit={handleSubmit}>
                    <div className=" flex flex-col items-center justify-center gap-4">
                        <div className='flex flex-col gap-3 w-full'>
                        <ErrorBlock error={error} className='shadow-sm text-red-500 px-3 py-1 rounded-xl relative' />
                        <input autoComplete='email' id="email" placeholder='Email' name='email' type="email" className="text-text flex items-center text-sm autofill:bg-secondary outline-none bg-secondary placeholder:text-text/80 rounded-full px-6 py-3 w-full placeholder:opacity-50" />
                        <input autoComplete='password' id="password" placeholder='Password' name='password' type="password" className="text-text flex items-center text-sm autofill:bg-secondary outline-none bg-secondary placeholder:text-text/80 rounded-full px-6 py-3 w-full placeholder:opacity-50" />
                        </div>
                        <button type='submit' className="w-full rounded-full text-text py-2 bg-secondary hover:bg-tertiary transition duration-200">Login</button>
                        {!isLoading ? (
                            <div className='flex flex-col gap-3 w-full text-text '>
                                <button type='button' onClick={() => { signIn('google', { callbackUrl: '/' }) }} className='w-full rounded-full flex justify-center items-center gap-4 py-3 bg-secondary hover:bg-tertiary transition duration-200'>
                                    <p>Continue with Google</p>
                                    <FaGoogle className='w-5 h-5' />
                                </button>
                                <button type='button' onClick={() => { signIn('discord', { callbackUrl: '/' }) }} className='w-full rounded-full flex justify-center items-center gap-4 py-3 bg-secondary hover:bg-tertiary transition duration-200'>
                                    <p>Continue with Discord</p>
                                    <FaDiscord className='w-5 h-5' />
                                </button>
                            </div>) : (<ElementLoader className='flex flex-col items-center justify-center gap-5' />)}
                        <Link href="/auth/signup" className='text-text opacity-60  underline underline-offset-4 hover:opacity-100 duration-200 transition'>Don't have an account ?</Link>
                    </div>
                </form>
            </div>
        </section>

    )
}

export default Form