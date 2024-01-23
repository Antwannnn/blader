'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Home = () => {

    const router = useRouter();
    const [inputState, setInputState] = useState('');

    useEffect(() => {
        if (inputState === 'start') {
            router.push('/game/typetester');
        }

    }, [inputState])

  return (
      
    <motion.section 
    initial={{x: 300, opacity: 0 }}
    animate={{x: 0, opacity: 1 }}
    exit={{ x: 300, opacity: 0 }}
    transition={{ duration: 0.5, type: "spring", bounce: 0.25}}
    className="flex flex-col h-screen justify-center gap-5 py-24 items-center  overflow-hidden">
    <div className="hero flex flex-col items-center px-4 justify-center text-center">

      <Image
        className="logo"
        src="/assets/images/logo-white.png"
        alt="blader logo"
        width={150}
        height={150}
      />
      <h1 className="overflow-hidden text-4xl text-secondary_light">Welcome to <span className="text-primary_light font-bold">blader</span>.</h1>
      <p className="text-secondary_light text-xl">The ultimate typing speed tester.</p>
    </div>
    <div className="enterbar">
      <div className="flex flex-col items-center justify-center">
        <input placeholder='Type "start" to enter.' type="text" value={inputState} onChange={(e) => { setInputState(e.target.value) }} className="text-secondary_light flex items-center text-sm outline-none bg-secondary_dark rounded-full px-4 py-2 mt-5  placeholder:opacity-50" />
      </div>
    </div>

  </motion.section>
  )
}

export default Home