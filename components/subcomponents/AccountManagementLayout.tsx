import { CiLogin, CiLogout } from "@node_modules/react-icons/ci";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from 'next/link';
import { BsPersonPlus } from "react-icons/bs";

type AccountManagementLayoutProps = {
    isUserLoggedIn: boolean,
    username: string | undefined,
    className?: string
}

const AccountManagementLayout = ({isUserLoggedIn, username, className}: AccountManagementLayoutProps) => {

  const { data: session, status } = useSession();

  return (
    <>
    {isUserLoggedIn ? (
        <div className={className}>
          <button type='button' onClick={() => signOut()}>
            <div className='flex gap-2 px-4 lg:py-2 py-1 rounded-full bg-secondary hover:bg-tertiary text-text transition duration-200 items-center justify-center text-md'>
              <CiLogout className='w-5 h-5' />
              Logout</div>
          </button>
          <Link className="flex justify-center py-1" href={`/account/profile/${session?.user?.name}`}>
            <div className='flex gap-2 px-4 py-1 rounded-full items-center text-md bg-secondary hover:bg-tertiary text-text transition duration-200'>
              <Image
              src={session?.user?.image ? session?.user?.image : '/assets/icon/default.png'}
              alt='user profile image'
              width={24}
              height={24}
              className='rounded-full'
              />
              {username?.length && username.length > 9 ? username.slice(0, 7).concat('...') : username}</div>
          </Link>


        </div>
      ) :
        (<div className={className}>
          <Link href='/auth/login'>
            <div className='flex gap-2 px-3 p-2 rounded-full text-md text-text bg-secondary hover:bg-tertiary transition duration-200'>
              <CiLogin className='w-5 h-5' />
              Login
              </div>
          </Link>
          <Link href='/auth/signup'>
            <div className='flex gap-2 px-3 p-2 rounded-full text-md text-text bg-secondary hover:bg-tertiary transition duration-200'>
              <BsPersonPlus className='w-5 h-5' />
              Sign-up
              </div>
          </Link>
          </div>)}
          </>
  )
}

export default AccountManagementLayout