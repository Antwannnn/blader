"use client"

type ProfileProps = {
    username: string,
    email: string,
    avatar: string,
    averageWPM: number,
    averageAccuracy: number,
    averageErrors: number,
    totalWordsTyped: number,
}


export default function Profile({username, email, avatar, averageWPM, averageAccuracy, averageErrors, totalWordsTyped}: ProfileProps) {

    console.log(username, email, avatar, averageWPM, averageAccuracy, averageErrors, totalWordsTyped);

    return (
        <section className="flex flex-col items-center justify-center gap-5">
            <div className="flex flex-col items-center justify-center gap-5">
                <img src={avatar} alt="avatar" className="rounded-full w-24 h-24" />
                <h1 className="text-2xl font-bold text-secondary_light">{username}</h1>
                <h2 className="text-sm text-secondary_light">{email}</h2>
            </div>
            <div className="flex flex-col items-center justify-center gap-5">
                <div className="flex flex-col items-center justify-center gap-5">
                    <h1 className="text-2xl font-bold text-secondary_light">Average WPM</h1>
                    <h2 className="text-sm text-secondary_light">{averageWPM}</h2>
                </div>
                <div className="flex flex-col items-center justify-center gap-5">
                    <h1 className="text-2xl font-bold text-secondary_light">Average Accuracy</h1>
                    <h2 className="text-sm text-secondary_light">{averageAccuracy}</h2>
                </div>
                <div className="flex flex-col items-center justify-center gap-5">
                    <h1 className="text-2xl font-bold text-secondary_light">Average Errors</h1>
                    <h2 className="text-sm text-secondary_light">{averageErrors}</h2>
                </div>
                <div className="flex flex-col items-center justify-center gap-5">
                    <h1 className="text-2xl font-bold text-secondary_light">Total Words Typed</h1>
                    <h2 className="text-sm text-secondary_light">{totalWordsTyped}</h2>
                </div>
            </div>
        </section>
    )
}