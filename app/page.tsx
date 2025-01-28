'use client'

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

    <section

      className="flex flex-col h-screen justify-center gap-1 py-24 items-center  overflow-hidden">
      <div className="hero flex flex-col items-center px-4 justify-center text-center">

        <Image
          className="logo"
          src="/assets/images/logo-white.png"
          alt="blader logo"
          width={150}
          height={150}
        />
        <h1 className="overflow-hidden text-4xl text-text">Welcome to <span className="text-text font-bold">blader</span>.</h1>
        <p className="text-text text-xl">The ultimate typing speed tester.</p>
      </div>
      <div className="enterbar">
        <div className="flex flex-col items-center justify-center">
          <input autoComplete="off" placeholder='Type "start" to enter.' type="text" value={inputState} onChange={(e) => { setInputState(e.target.value) }} className="text-text flex items-center text-sm outline-none bg-text/20 rounded-full px-4 py-2 mt-5  placeholder:opacity-50" />
        </div>
      </div>

    </section>
  )
}

export default Home