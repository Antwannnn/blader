"use client"

import { UserData, StatisticsData } from "@app/types/Data"
import LoadableWrapper from "@components/subcomponents/LoadableWrapper"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import UserStatistics from "@models/UserStatistics"


const Profile = () => {

    const { data: session, status } = useSession();
    const [userData, setUserData] = useState<UserData>();
    const [userStatistics, setUserStatistics] = useState<StatisticsData>();
    const [loading, setLoading] = useState<boolean>(true);

    const router = usePathname();

    useEffect(() => {
        const fetcher = async () => {


            const urlLastSegment = router.split('/').pop();


            const res = await fetch(`/api/user/${urlLastSegment}`);
            const data = await res.json();

            if (res.status === 404) { setUserData(undefined); setLoading(false); return };
            const { name, email, image, keyboard, bio, badges, createdAt, isAdmin, isVerified } = data.user;

            const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
            setUserData({
                username: name,
                email: email,
                avatar: image,
                isAdmin: isAdmin,
                isVerified: isVerified,
                keyboard: keyboard,
                bio: bio,
                badges: badges,
                accountCreated: formattedDate,
            })

            const stats = await fetch(`/api/user/statistics/${data.user._id}`);
            const statsData = await stats.json();
            const { averageWPM, averageAccuracy, averageErrors, totalWords, totalCharacters, totalErrors, totalGames } = statsData;

            setUserStatistics({
                averageWPM: averageWPM,
                averageAccuracy: averageAccuracy,
                averageErrors: averageErrors,
                totalWords: totalWords,
                totalCharacters: totalCharacters,
                totalErrors: totalErrors,
                totalGames: totalGames
            })

            setLoading(false);
        }
        fetcher();
    }, [session])

    return (

        <LoadableWrapper clasName="flex h-screen w-full items-center justify-center" condition={!loading}>
            {userData !== undefined ? (
                <section className="flex flex-col items-center justify-center sm:justify-start gap-5 pt-52 md:pt-0 w-5/6 text-primary_light ">
                    <div className="flex flex-col w-full md:flex-row gap-2 md:justify-start justify-center">
                        <div className="flex flex-col w-full md:w-2/6 gap-2 justify-center items-center bg-secondary_dark bg-opacity-40 p-2 rounded-xl">
                            <Image
                                src={userData?.avatar || '/assets/icons/default.png'}
                                width='100'
                                height='100'
                                alt={`${userData?.username} profile picture`}
                                className="rounded-full"
                            />
                            <h2 className="text-2xl font-bold overflow-hidden">{userData?.username}</h2>
                        </div>
                        <div className="flex flex-col h-full md:w-2/6 gap-3 ">
                            <h3 className="text-md text-tertiary_light gap-2 justify-center bg-secondary_dark bg-opacity-40 p-5 rounded-xl">Typing since : <span className="text-primary_light">{userData?.accountCreated}</span></h3>
                            <h3 className="text-md text-tertiary_light text-pret gap-2 justify-center bg-secondary_dark bg-opacity-40 p-5 rounded-xl">Keyboard :  <span className="text-primary_light">{userData?.keyboard}</span></h3>
                            <h3 className="text-md  text-tertiary_light text-pret gap-2 justify-center bg-secondary_dark bg-opacity-40 p-5 rounded-xl">Badges :  <span className="text-primary_light">{userData?.badges?.length! > 0 ? userData?.badges : 'This user hasn\'t got any badge.'}</span></h3>

                        </div>
                        <div className="flex flex-row md:flex-col gap-3 md:w-2/6">
                            <h3 className="text-md md:h-4/6 w-full text-tertiary_light text-pret gap-2 justify-center bg-secondary_dark bg-opacity-40 p-5 rounded-xl">Bio :  <span className="text-primary_light">{userData?.bio}</span></h3>
                            <div className="text-center text-xl w-full flex flex-col gap-2 justify-center md:h-2/6  bg-secondary_dark bg-opacity-40 p-3 rounded-xl">
                                <h3 >Total Games Played : {userStatistics?.totalGames ? userStatistics?.totalGames : '0'}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full justify-center h-fit">
                        <div className="flex justify-center w-full text-md sm:text-xl flex-row gap-3">
                            <div className="w-1/3 text-center flex flex-col gap-2 justify-start h-full bg-secondary_dark bg-opacity-40 p-3 rounded-xl">
                                <h3 >Average WPM : </h3>
                                <h3>{userStatistics?.averageWPM ? userStatistics?.averageWPM : '-'}</h3>
                            </div>
                            <div className="w-1/3 text-center flex flex-col gap-2 justify-start h-full bg-secondary_dark bg-opacity-40 p-3 rounded-xl">
                                <h3 >Average Accuracy : </h3>
                                <h3>{userStatistics?.averageAccuracy ? userStatistics?.averageAccuracy : '-'}</h3>
                            </div>
                            <div className="w-1/3 text-center flex flex-col gap-2 justify-start h-full bg-secondary_dark bg-opacity-40 p-3 rounded-xl">
                                <h3 >Average Errors : </h3>
                                <h3>{userStatistics?.averageErrors ? userStatistics?.averageErrors : '-'}</h3>
                            </div>
                        </div>
                        <div className="flex justify-center w-full text-md sm:text-xl flex-row gap-3">
                            <div className="w-1/3 text-center flex flex-col gap-2 justify-start h-full bg-secondary_dark bg-opacity-40 p-3 rounded-xl">
                                <h3 >Total Words : </h3>
                                <h3>{userStatistics?.totalWords ? userStatistics?.totalWords : '-'}</h3>
                            </div>
                            <div className="w-1/3 text-center flex flex-col gap-2 justify-start h-full bg-secondary_dark bg-opacity-40 p-3 rounded-xl">
                                <h3 >Total characters : </h3>
                                <h3>{userStatistics?.totalCharacters ? userStatistics?.totalCharacters : '-'}</h3>
                            </div>
                            <div className="w-1/3 text-center flex flex-col gap-2 justify-start h-full bg-secondary_dark bg-opacity-40 p-3 rounded-xl">
                                <h3 >Total Errors : </h3>
                                <h3>{userStatistics?.totalErrors ? userStatistics?.totalErrors : '-'}</h3>
                            </div>
                        </div>
                    </div>
                </section>) : (<div className="h-full w-full font-bold text-5xl text-primary_light flex justify-center items-center text-center">User not found <br /> (ㅠ﹏ㅠ)</div>)}
        </LoadableWrapper>
    )
}

export default Profile