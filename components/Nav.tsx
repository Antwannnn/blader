"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import AccountManagementLayout from './subcomponents/AccountManagementLayout';
import { CiStopwatch, CiTrophy, CiFlag1 } from 'react-icons/ci';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';


const activeStyle = 'active !opacity-100'

const appearVariants = {
  hidden: {
    opacity: 0,
    x: 100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      duration: 0.2,
      stiffness: 100,
      mass: 0.5,
      damping: 10,
    },
  },
};


const navlinks = [
  { name: 'Type Tester', link: '/game/typetester', icon: <CiStopwatch className='w-4 h-4' /> },
  { name: 'Type Racer', link: '/game/typeracer', icon: <CiFlag1 className='w-4 h-4' /> },
  { name: 'Leaderboard', link: '/leaderboard', icon: <CiTrophy className='w-4 h-4' /> },
]

const Nav = () => {
  const [theme, setTheme] = useState('dark');
  const [toggleDropdown, setToggleDropdown] = useState(false);

  const appear = useAnimation();
  const router = usePathname();
  const { data: session, status } = useSession();
  const username = session?.user?.name?.toString();

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme === 'light' ? 'light' : '');
  };

  const handleDropdown = () => {
    if (toggleDropdown) {
      appear.start('hidden');
      setTimeout(() => {
        setToggleDropdown(false);
      }, 200);
    } else {
      setToggleDropdown(true);
      appear.start('visible');
    }
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme === 'light' ? 'light' : 'dark');
  }, []);
  
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);


  return (
    <div>
      <nav className="lg:grid grid-rows-1 hidden place-items-center grid-cols-2 lg:grid-cols-4 w-full z-20 overflow-visible bg-background text-sm py-3 fixed px-3">
        <Link href="/" className='flex place-self-start items-center overflow-hidden'>
          <Image
            className='logo cursor-pointer rounded-full'
            src={theme === 'dark' ? "/assets/images/logo-white.png" : "/assets/images/logo.png"}
            alt="blader logo"
            width={50}
            height={50}
          />
          <p className='text-xl text-text text-pretty'>blader.</p>
        </Link>
        <div className='lg:flex col-span-2 justify-evenly hidden gap-2 lg:gap-3'>
          {navlinks.map((link, index) => (
            <Link key={index} href={link.link}>
              <div className={`text-text text-sm flex gap-1 ${(router == link.link ? activeStyle : "")}`}>
                {link.name}
                {link.icon}
              </div>
            </Link>
          ))}
        </div>

        <div className='flex items-center gap-4'>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-theme-tertiary transition-colors duration-200"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-theme">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-theme">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            )}
          </button>
          <div className='lg:flex items-center h-full place-self-end loginrelated hidden'>
            <AccountManagementLayout isUserLoggedIn={status === 'authenticated'} username={username} className='flex gap-2 justify-evenly' />
          </div>
        </div>
      </nav>
      <div className='lg:hidden flex-col gap-3 absolute items-end top-6 right-0 flex overflow-x-hidden'>
        <button onClick={() => handleDropdown()} className='flex gap-2 mr-3'>
          <svg className="w-6 h-6 text-text opacity-70 hover:opacity-100 transition duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {toggleDropdown ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            )}
          </svg>
        </button>
        <motion.div className='place-self-end bg-secondary_dark bg-opacity-40 rounded-md shadow-lg'
          initial={'hidden'}
          variants={appearVariants}
          animate={appear}
        >
          {toggleDropdown && (

            <div className='flex flex-col items-center gap-5 px-4 py-5'>
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-theme-tertiary transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-theme">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-theme">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                  </svg>
                )}
              </button>
              <Link href="/" className='flex gap-2 flex-center overflow-hidden'>
                <Image
                  className='logo cursor-pointer rounded-full'
                  src={theme === 'dark' ? "/assets/images/logo-white.png" : "/assets/images/logo.png"}
                  alt="blader logo"
                  width={50}
                  height={50}
                />
                </Link>

                <AccountManagementLayout isUserLoggedIn={status === 'authenticated'} username={username} className='flex flex-col-reverse gap-2 justify-evenly' />

                <div className='separator w-full' />
                {navlinks.map((link, index) => (
                  <Link key={index} href={link.link}>
                    <div className={`flex text-text text-sm gap-1 ${(router == link.link ? activeStyle : "")}`}>
                      {link.name}
                      {link.icon}
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Nav