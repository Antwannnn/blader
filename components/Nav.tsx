"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import AccountManagementLayout from './subcomponents/AccountManagementLayout';
import { CiStopwatch, CiTrophy, CiFlag1 } from 'react-icons/ci';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaArrowCircleDown } from '@node_modules/react-icons/fa';
import Logo from './subcomponents/Logo';
import ThemeModal from './ThemeModal';


const activeStyle = 'text-text opacity-100'

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
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const pathname = usePathname();

  const appear = useAnimation();
  const router = useRouter();
  const { data: session, status } = useSession();
  const username = session?.user?.name?.toString();


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

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    
    localStorage.setItem('theme', newTheme);
    
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000; SameSite=Strict`;
    
    document.documentElement.setAttribute('data-theme', newTheme);
    
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.setAttribute('href', `/api/favicon/${newTheme}?t=${Date.now()}`);
    }
    
    router.refresh();
    
    window.dispatchEvent(new CustomEvent('themeChange', { detail: newTheme }));
    
    setIsThemeOpen(false);
  };

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'light';

    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  


  const ThemeComponent = ({orientation}: {orientation: 'left' | 'right'}) => {
    const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

    return (
      <div className="relative z-50 overflow-visible">
        <button 
          onClick={() => setIsThemeModalOpen(true)}
          className="px-2 py-1 ml-0 lg:ml-2 rounded-xl hover:bg-tertiary bg-secondary transition-colors duration-200 flex items-center gap-2"
          aria-label="Toggle theme"
        >
          <span className='text-text text-xs'>
            {mounted ? `Theme : ${theme}` : 'Theme : light'}
          </span>
        </button>

        {isThemeModalOpen && mounted && (
          <ThemeModal
            onClose={() => setIsThemeModalOpen(false)}
            currentTheme={theme}
            onThemeChange={handleThemeChange}
          />
        )}
      </div>
    );
  };

  return (
    <> 
      <nav className="lg:grid  grid-rows-1 hidden overflow-visible place-items-center grid-cols-2 lg:grid-cols-4 w-full z-20 text-sm py-3 fixed px-3">
        <Link href="/" className='flex place-self-start items-center overflow-hidden'>
          <Logo />
          <p className='text-xl text-text text-pretty'>blader.</p>

        </Link>

        <div className='lg:flex overflow-visible col-span-2 justify-evenly items-center hidden gap-2 lg:gap-3'>
          {navlinks.map((link, index) => (
            <Link key={index} href={link.link}>
              <div className={`text-text text-sm flex items-center duration-200 opacity-60 hover:opacity-100 gap-1 ${(pathname === link.link ? activeStyle : "")}`}>
                {link.name}
                {link.icon}
              </div>
            </Link>
          ))}
          <ThemeComponent orientation='right' />

        </div>
        <div className='flex items-center w-full gap-4'>

          <div className='lg:flex items-center h-full w-full justify-end loginrelated hidden'>
            <AccountManagementLayout isUserLoggedIn={status === 'authenticated'} username={username} className='flex gap-2 justify-evenly' />
          </div>
        </div>
      </nav>
      <div className='lg:hidden gap-3 items-end flex-col  flex overflow-x-hidden '>
      <div className='flex absolute top-2 overflow-visible left-2 flex-col items-center gap-5'>
        <ThemeComponent orientation='left' />
      </div>
      <button onClick={() => handleDropdown()} className='flex absolute top-2 right-2 gap-2 z-50'>
          <svg className="w-6 h-6 text-text opacity-70 hover:opacity-100 transition duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {toggleDropdown ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            )}
          </svg>
        </button>
        <motion.div className='place-self-end absolute z-40 bg-background bg-opacity-40 rounded-md shadow-lg'
          initial={'hidden'}
          variants={appearVariants}
          animate={appear}
        >

          {toggleDropdown && (

            <div className='flex flex-col items-center gap-5 px-4 py-5'>
              <Link href="/" className='flex gap-2 flex-center overflow-hidden'>
                <Logo className='!w-12 !h-12' />
                </Link>

                <AccountManagementLayout isUserLoggedIn={status === 'authenticated'} username={username} className='flex flex-col-reverse gap-2 justify-evenly' />

                <div className='separator w-full' />
                {navlinks.map((link, index) => (
                  <Link key={index} href={link.link}>
                    <div className={`flex text-text text-sm opacity-60 hover:opacity-100 gap-1 ${(pathname === link.link ? activeStyle : "")}`}>
                      {link.name}
                      {link.icon}
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </motion.div>

      </div>
      </>

  )
}

export default Nav