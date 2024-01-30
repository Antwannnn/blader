import React from 'react'

const Footer = () => {
  return (
    <footer className="flex items-center justify-around w-full md:h-12 h-16 absolute bottom-0 font-bold bg-opacity-40 text-xs bg-secondary_dark ">
        <p>Made by <a href="https://github.com/Antwannnn">Antoine Leboucher</a></p>
        <p className='md:block hidden'>Contact me at antwanlbr.work@gmail.com</p>
        <p>© 2024 blader - All rights reserved.</p>
    </footer>
  )
}

export default Footer