"use client"

import { ProfileData } from "@app/account/profile/data"
import LoadableWrapper from "@components/subcomponents/LoadableWrapper"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import {usePathname} from "next/navigation"
import Image from "next/image"
import { url } from "inspector"


const Profile = () => {

    const { data: session, status } = useSession();
    const [profileData, setProfileData] = useState<ProfileData>();
    const [loading, setLoading] = useState<boolean>(true);

    const router = usePathname();



    useEffect(() => {
        const fetcher = async () => {


                const urlLastSegment = router.split('/').pop();


                const res = await fetch(`/api/user/${urlLastSegment}`);
                const data = await res.json();

                if (res.status === 404) { setProfileData(undefined); setLoading(false); return };
                const { name, email, image, keyboard, createdAt, isAdmin, isVerified, averageWPM, averageAccuracy, averageErrors, totalWords } = data.user;

                const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'}) : 'N/A';



                setProfileData({
                    username: name,
                    email: email,
                    avatar: image,
                    isAdmin: isAdmin,
                    isVerified: isVerified,
                    keyboard: keyboard,
                    averageWPM: averageWPM,
                    averageAccuracy: averageAccuracy,
                    averageErrors: averageErrors,
                    totalWords: totalWords,
                    accountCreated: formattedDate,
                })

                setLoading(false);



        }
        fetcher();
    }, [session])

    return (
        <LoadableWrapper clasName="flex h-screen w-full items-center justify-center" condition={!loading}>

            {profileData !== undefined ? (<section className="flex flex-col items-center justify-center sm:justify-start gap-10 py-10 text-primary_light">
                <h1 className="text-5xl font-bold overflow-hidden">{profileData?.username}'s Profile</h1>
                <div className="flex sm:flex-row flex-col w-full items-center border-y-2 py-10 border-opacity-10 border-secondary_light gap-4 overflow-hidden">
                    <Image
                        src={profileData?.avatar || '/assets/icons/default.png'}
                        width='100'
                        height='100'
                        alt={`${profileData?.username} profile picture`}
                        className="rounded-full"
                    />
                    <div className="flex flex-col text-center sm:text-start gap-4 sm:border-r-2 px-5">
                        <h2 className="text-4xl font-bold overflow-hidden">{profileData?.username}</h2>
                        <h2 className="text-xl text-tertiary_light">{profileData?.email}</h2>
                    </div>
                    <div className="flex gap-4 items-center sm:text-start sm:border-r-2 px-5">
                        <p className="text-xl text-tertiary_light"><span className="font-bold">Member since : </span><span className="italic">{profileData?.accountCreated}</span></p>
                    </div>
                </div>
                <div className="grid sm:grid-cols-4 grid-cols-2 sm:grid-rows-1 grid-rows-2 gap-5">
                    <div className="flex flex-col px-4">
                        <h3 className="text-2xl font-bold">Average WPM</h3>
                        <p className="text-2xl text-secondary_light">{profileData?.averageWPM}</p>
                    </div>
                    <div className="flex flex-col border-l-2 border-tertiary_light border-opacity-10 px-4">
                        <h3 className="text-2xl font-bold">Average Accuracy</h3>
                        <p className="text-2xl text-secondary_light">{profileData?.averageAccuracy}</p>
                    </div>
                    <div className="flex flex-col sm:border-l-2 border-tertiary_light border-opacity-10  px-4">
                        <h3 className="text-2xl font-bold">Average Errors</h3>
                        <p className="text-2xl text-secondary_light">{profileData?.averageErrors}</p>
                    </div>
                    <div className="flex flex-col border-l-2 border-tertiary_light border-opacity-10 px-4">
                        <h3 className="text-2xl font-bold">Total Words</h3>
                        <p className="text-2xl text-secondary_light">{profileData?.totalWords}</p>
                    </div>
                </div>

            </section>) : ( <div className="h-full w-full font-bold text-5xl text-primary_light flex justify-center items-center text-center">User not found <br /> (ㅠ﹏ㅠ)</div>)}
        </LoadableWrapper>
    )
}

export default Profile