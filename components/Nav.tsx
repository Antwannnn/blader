"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion, useAnimation} from 'framer-motion';
import AccountManagementLayout from './subcomponents/AccountManagementLayout';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

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
  { name: 'Type Tester', link: '/game/typetester', icon: "/assets/svgs/stopwatch.svg"},
  { name: 'Type Racer', link: '/game/typeracer', icon: '/assets/svgs/race.svg' },
  { name: 'Leaderboard', link: '/leaderboard', icon: '/assets/svgs/crown.svg' },
]

const Nav = () => {


  const [toggleDropdown, setToggleDropdown] = useState(false);

  const appear = useAnimation();
  const router = usePathname();
  const isUserLoggedIn = false;
  const username = 'testuser';

  const handleDropdown = () => {
    if(toggleDropdown){
      appear.start('hidden');
      setTimeout(() => {
        setToggleDropdown(false);
      }, 200);
    } else{
      setToggleDropdown(true);
      appear.start('visible');
    }
  }


  return (
    <nav className="flex-between w-full z-20 overflow-visible bg-secondary_dark text-sm py-3 fixed px-5">
      <Link href="/" className='flex gap-2 flex-center overflow-hidden'>
        <Image
          className='logo cursor-pointer rounded-full'
          src="/assets/images/logo-white.png"
          alt="blader logo"
          width={50}
          height={50}
        />
        <p className='text-xl text-secondary_light'>blader.</p>
      </Link>
      <div className='sm:flex navlinks justify-evenly hidden gap-2 lg:gap-3'>
        {navlinks.map((link, index) => (
        <Link key={index} href={link.link}>
          <div className={`navlink gap-1 ${(router == link.link ? activeStyle : "")}`}>
            {link.name} 
            <img className='w-4 h-4' src={link.icon} alt="leaderboard icon" />
          </div>
        </Link>
        ))}
      </div>
      <div className='sm:flex loginrelated hidden '>
        <AccountManagementLayout isUserLoggedIn={isUserLoggedIn} username={username} className='flex gap-2 justify-evenly' />
      </div>
      <div className='sm:hidden flex-col gap-3 absolute items-end top-6 right-0 flex overflow-x-hidden'>
        <button onClick={() => handleDropdown()} className='flex gap-2 mr-3'>
          <svg className="w-6 h-6 text-secondary_light opacity-70 hover:opacity-100 transition duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {toggleDropdown ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            )}
          </svg>
        </button>
        <motion.div className='bg-secondary_dark rounded-md shadow-lg'
            initial= {'hidden'}
            variants={appearVariants}
            animate={appear}
        >
          {toggleDropdown && (
            <div className='flex flex-col items-center gap-5 px-4 py-5'>

              <AccountManagementLayout isUserLoggedIn={isUserLoggedIn} username={username} className='flex flex-col-reverse gap-2 justify-evenly' />

              <div className='separator w-full'/>
              {navlinks.map((link, index) => (
                <Link key={index} href={link.link}>
                  <div className={`navlink gap-1 ${(router == link.link ? activeStyle : "")}`}>
                    {link.name}
                    <img className='w-4 h-4' src={link.icon} alt="leaderboard icon" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </nav>
  )
}

export default Nav