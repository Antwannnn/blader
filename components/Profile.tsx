"use client"

import { ProfileData } from "@app/account/profile/data"
import LoadableWrapper from "@components/subcomponents/LoadableWrapper"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"


const Profile = () => {

    const { data: session, status } = useSession();
    const [profileData, setProfileData] = useState<ProfileData>();



    useEffect(() => {
        const fetcher = async () => {

            if (status === 'authenticated') {

                const res = await fetch(`/api/user/${session?.user?.name}`);
                const data = await res.json();

                console.log(data);

                const { name, email, averageWPM, averageAccuracy, averageErrors, totalWords, image } = data.user;

                setProfileData({
                    username: name,
                    email: email,
                    averageWPM: averageWPM ? averageWPM : 0,
                    averageAccuracy: averageAccuracy ? averageAccuracy : 0,
                    averageErrors: averageErrors ? averageErrors : 0,
                    totalWords: totalWords ? totalWords : 0,
                    avatar: image ? image : '/assets/icon/default.png'
                })


            }
        }
        fetcher();
    }, [session])

    return (
        <LoadableWrapper clasName="flex h-screen w-full items-center justify-center" condition={status === 'authenticated'}>

            <section className="flex flex-col items-center justify-center gap-5">
                <div className="flex flex-col items-center justify-center gap-5">
                    <img src={profileData?.avatar} alt="avatar" className="rounded-full w-24 h-24" />
                    <h1 className="text-2xl font-bold text-secondary_light">{profileData?.username}</h1>
                    <h2 className="text-sm text-secondary_light">{profileData?.email}</h2>
                </div>
                <div className="flex flex-col items-center justify-center gap-5">
                    <div className="flex flex-col items-center justify-center gap-5">
                        <h1 className="text-2xl font-bold text-secondary_light">Average WPM</h1>
                        <h2 className="text-sm text-secondary_light">{profileData?.averageWPM}</h2>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-5">
                        <h1 className="text-2xl font-bold text-secondary_light">Average Accuracy</h1>
                        <h2 className="text-sm text-secondary_light">{profileData?.averageAccuracy}</h2>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-5">
                        <h1 className="text-2xl font-bold text-secondary_light">Average Errors</h1>
                        <h2 className="text-sm text-secondary_light">{profileData?.averageErrors}</h2>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-5">
                        <h1 className="text-2xl font-bold text-secondary_light">Total Words Typed</h1>
                        <h2 className="text-sm text-secondary_light">{profileData?.totalWords}</h2>
                    </div>
                </div>
            </section>
        </LoadableWrapper>
    )
}

export default Profile