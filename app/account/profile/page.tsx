"use client";

import { useEffect } from "react"
import Profile from "@components/Profile"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import LoadableWrapper from "@components/subcomponents/LoadableWrapper"
import { getServerSession } from 'next-auth';

const ProfilePage = () => {

  const { data: session, status } = useSession();


  useEffect(() => {
    if(session){
     const fetcher = async () => {
        const currentsession = await getServerSession();
        if(!currentsession){
          redirect('/auth/login');
        }
        const res = await fetch(`/api/user/${session?.user?.id}`);
        const data = await res.json();
        console.log(data);
      }
    }
  }, [session])

  const { username, email, avatar, averageWPM, averageAccuracy, averageErrors, totalWordsTyped } = {
    username: "test",
    email: "ddd",
    avatar: "truc.jpg",
    averageWPM: 0,
    averageAccuracy: 0,
    averageErrors: 0,
    totalWordsTyped: 0,
  };

  return (
    <LoadableWrapper clasName="flex h-screen w-full items-center justify-center" condition={status === 'authenticated'}>
      <Profile 
      {...{username, email, avatar, averageWPM, averageAccuracy, averageErrors, totalWordsTyped}}/>
    </LoadableWrapper>

  )
}

export default ProfilePage