"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';

const Nav = () => {
  return (
    <nav className="flex-between w-full bg-secondary_dark text-sm py-5 px-5">
      <Link href="/" className='flex gap-2 flex-center'>
        <Image 
          className='cursor-pointer rounded-full'
          src="/assets/images/logo-white.png"
          alt="blader logo"
          width={50}
          height={50}
        />
        <p className='text-xl text-secondary_light'>blader.</p>
      </Link>
      <div className='flex loginrelated justify-around gap-2'>
        <Link href='/type-tester'>
          <p className='px-4 py-1 rounded-full text-md button-primary-dark'>Login</p>
        </Link>
        <Link href='/type-racer'>
          <p className='px-3 py-1 rounded-full text-md button-primary-dark'>Sign-up</p>
        </Link>
      </div>
    </nav>
  )
}

export default Nav