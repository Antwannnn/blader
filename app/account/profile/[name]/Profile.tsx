"use client"

import { ProfileData } from "@app/types/Data"
import LoadableWrapper from "@components/subcomponents/LoadableWrapper"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import Image from "next/image"


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
            const { name, email, image, keyboard, createdAt, isAdmin, isVerified, averageWpm, averageAccuracy, averageErrors, totalWords, totalCharacter, totalErrors } = data.user;

            const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';



            setProfileData({
                username: name,
                email: email,
                avatar: image,
                isAdmin: isAdmin,
                isVerified: isVerified,
                keyboard: keyboard,
                averageWPM: averageWpm,
                averageAccuracy: averageAccuracy,
                averageErrors: averageErrors,
                totalWords: totalWords,
                totalCharacters: totalCharacter,
                totalErrors: totalErrors,
                totalGames: 0,
                accountCreated: formattedDate,
            })

            setLoading(false);



        }
        fetcher();
    }, [session])

    return (
        
        <LoadableWrapper clasName="flex h-screen w-full items-center justify-center" condition={!loading}>
            {profileData !== undefined ? (<section className="flex flex-col items-center  justify-center sm:justify-start gap-10 mt-40 my-20  text-primary_light ">
                <h1 className="lg:text-5xl text-3xl font-bold overflow-hidden">{profileData?.username}'s Profile</h1>
                <div className="flex lg:flex-row flex-col bg-secondary_dark rounded-xl lg:h-56 h-full border-y-2 py-10 gap-10 px-3 border-opacity-10 place-items-center lg:justify-items-start border-secondary_light ">
                    <div className="flex text-center items-center min-h-full w-full lg:text-start gap-4 bg-tertiary_dark py-5 px-5 rounded-xl bg-opacity-70">
                        <Image
                            src={profileData?.avatar || '/assets/icons/default.png'}
                            width='100'
                            height='100'
                            alt={`${profileData?.username} profile picture`}
                            className="rounded-full"
                        />
                        <div className="overflow-hidden ">
                            <h2 className="text-4xl font-bold overflow-hidden">{profileData?.username}</h2>
                            <h2 className="text-sm text-start text-tertiary_light overflow-hidden">{profileData?.email}</h2>
                        </div>
                    </div>
                    <div className="gap-4 flex items-center justify-center min-h-full w-full lg:text-start bg-tertiary_dark py-5 px-5 rounded-xl bg-opacity-70">
                        <p className="text-xl text-tertiary_light"><span className="font-bold">Member since : </span><span className="italic">{profileData?.accountCreated}</span></p>
                    </div> 
                    <div className="flex gap-4 min-h-full bg-tertiary_dark py-5 px-5 rounded-xl bg-opacity-70 w-full">
                        <p className="text-xl w-full flex flex-col justify-center sm:text-start text-center text-tertiary_light"><span className="font-bold">Keyboard : </span><span className="italic">{profileData?.keyboard}</span></p>
                    </div>
                </div>
                <div className="grid lg:grid-cols-4 grid-cols-2 lg:grid-rows-1 grid-rows-2 gap-5 bg-secondary_dark py-6 px-3 border-y-2 border-opacity-10 border-secondary_light rounded-xl">
                    <div className="flex flex-col px-4">
                        <h3 className="text-2xl font-bold">Average WPM</h3>
                        <p className="text-2xl text-secondary_light">{profileData?.averageWPM}</p>
                    </div>
                    <div className="flex flex-col border-l-2 border-tertiary_light border-opacity-10 px-4">
                        <h3 className="text-2xl font-bold">Average Accuracy</h3>
                        <p className="text-2xl text-secondary_light">{profileData?.averageAccuracy}</p>
                    </div>
                    <div className="flex flex-col lg:border-l-2 border-tertiary_light border-opacity-10  px-4">
                        <h3 className="text-2xl font-bold">Average Errors</h3>
                        <p className="text-2xl text-secondary_light">{profileData?.averageErrors}</p>
                    </div>
                    <div className="flex flex-col border-l-2 border-tertiary_light border-opacity-10 px-4">
                        <h3 className="text-2xl font-bold">Total Words</h3>
                        <p className="text-2xl text-secondary_light">{profileData?.totalWords}</p>
                    </div>
                    <div className="flex flex-col lg:border-t-2 border-tertiary_light border-opacity-10 px-4">
                        <h3 className="text-2xl font-bold">Total Characters</h3>
                        <p className="text-2xl text-secondary_light">{profileData?.totalCharacters}</p>
                    </div>
                    <div className="flex flex-col lg:border-t-2 border-tertiary_light border-opacity-10 px-4">
                        <h3 className="text-2xl font-bold">Total Errors</h3>
                        <p className="text-2xl text-secondary_light">{profileData?.totalErrors}</p>
                    </div>
                    <div className="flex flex-col lg:border-t-2 border-tertiary_light border-opacity-10 px-4">
                        <h3 className="text-2xl font-bold">Total Games</h3>
                        <p className="text-2xl text-secondary_light">{profileData?.totalGames}</p>
                    </div>
                </div>

            </section>) : (<div className="h-full w-full font-bold text-5xl text-primary_light flex justify-center items-center text-center">User not found <br /> (ㅠ﹏ㅠ)</div>)}
        </LoadableWrapper>
    )
}

export default Profile