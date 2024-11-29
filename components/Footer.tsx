import React from "react";

const Footer = () => {
  const currentDate = new Date().getFullYear();

  return (
    <footer className="flex items-center justify-around w-full md:h-12 h-16  sm:absolute bottom-0 font-bold bg-opacity-40 text-xs ">
      <p>
        Made by <a href="https://github.com/Antwannnn">Antoine Leboucher</a>
      </p>
      <p className="md:block hidden">
        Contact me at antoine.leboucher@icloud.com
      </p>
      <p>{currentDate}</p>
    </footer>
  );
};

export default Footer;
