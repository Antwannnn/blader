"use client"

import { UserData, StatisticsData } from "@app/types/Data"
import LoadableWrapper from "@components/subcomponents/LoadableWrapper"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { CiUser, CiCalendar, CiKeyboard, CiMedal, CiEdit } from "react-icons/ci"
import StatsModal from '@components/StatsModal'

const Profile = () => {
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState<UserData>();
    const [userStatistics, setUserStatistics] = useState<StatisticsData>();
    const [loading, setLoading] = useState<boolean>(true);
    const [isEditing, setIsEditing] = useState(false);
    const router = usePathname();
    const isOwnProfile = session?.user?.name === userData?.username;
    const [showStatsModal, setShowStatsModal] = useState<'wpm' | 'accuracy' | 'errors' | null>(null);

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const bio = formData.get('bio') as string;
        const keyboard = formData.get('keyboard') as string;

        try {
            const response = await fetch(`/api/user/${userData?.username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bio, keyboard }),
            });

            if (response.ok) {
                setUserData(prev => prev ? {
                    ...prev,
                    bio,
                    keyboard,
                } : prev);
                setIsEditing(false);
            } else {
                console.error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    useEffect(() => {
        const fetcher = async () => {
            const urlLastSegment = router.split('/').pop();
            const res = await fetch(`/api/user/${urlLastSegment}`, {
                method: 'GET',
            });
            const data = await res.json();

            if (res.status === 404) { 
                setUserData(undefined); 
                setLoading(false); 
                return;
            }

            const { name, email, image, keyboard, bio, badges, createdAt, isAdmin, isVerified } = data.user;
            const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }) : 'N/A';

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
            });

            const stats = await fetch(`/api/user/statistics/${data.user._id}`);
            const statsData = await stats.json();
            console.log(statsData);
            setUserStatistics(statsData);
            console.log(statsData);
            setLoading(false);
        }
        fetcher();
    }, [session, router]);


    const StatCard = ({ title, value, className = "" }: { title: string, value: string | number, className?: string }) => (
        <div className={`bg-secondary/40 hover:bg-secondary/100 duration-300 backdrop-blur-sm rounded-xl p-4 ${className}`}>
            <h3 className="text-text_secondary text-sm mb-1">{title}</h3>
            <p className="text-text text-lg font-semibold">{value}</p>
        </div>
    );

    const EditProfileModal = () => (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-secondary rounded-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-text">Edit Profile</h2>
                    <button 
                        onClick={() => setIsEditing(false)}
                        className="text-text hover:text-text/80"
                    >
                        ✕
                    </button>
                </div>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="avatar" className="block text-text mb-2">Avatar</label>
                        <input type="file" id="avatar" className="hidden" name="avatar" />
                    </div>
                    <div>
                        <label className="block text-text mb-2">Bio</label>
                        <textarea
                            name="bio"
                            defaultValue={userData?.bio}
                            className="w-full p-2 rounded bg-tertiary text-text"
                            placeholder="Write something about yourself"
                            rows={4}
                        />
                    </div>
                    <div>
                        <label className="block text-text mb-2">Keyboard</label>
                        <input
                            type="text"
                            name="keyboard"
                            defaultValue={userData?.keyboard}
                            className="w-full p-2 rounded bg-tertiary text-text"
                            placeholder="Enter your keyboard"
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 rounded bg-tertiary text-text hover:bg-tertiary/80"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded text-background bg-text/80 hover:bg-text duration-150"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return (
        <LoadableWrapper clasName="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-12" condition={!loading}>
            {userData ? (
                <div className="w-full h-full space-y-6">
                    {/* En-tête du profil */}
                    <div className="bg-secondary/40 backdrop-blur-sm rounded-xl p-6">
                        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                            <div className="relative">
                                <Image
                                    src={userData.avatar || '/assets/icons/default.png'}
                                    width={120}
                                    height={120}
                                    alt={`${userData.username}'s profile picture`}
                                    className="rounded-full"
                                />
                                {userData.isVerified && (
                                    <div className="absolute -bottom-2 -right-2 bg-accent p-1.5 rounded-full">
                                        <CiMedal className="w-5 h-5 text-text" />
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                    <h1 className="text-3xl font-bold text-text">{userData.username}</h1>
                                    {isOwnProfile && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="p-2 rounded-full hover:bg-tertiary/40 transition-colors"
                                            title="Edit profile"
                                        >
                                            <CiEdit className="w-5 h-5 text-text" />
                                        </button>
                                    )}
                                    {userData.isAdmin && (
                                        <span className="bg-accent/20 text-accent px-2 py-0.5 rounded-full text-sm">
                                            Admin
                                        </span>
                                    )}
                                </div>
                                
                                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-text_secondary">
                                    <div className="flex items-center gap-1">
                                        <CiCalendar className="w-4 h-4" />
                                        <span>Joined {userData.accountCreated}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <CiKeyboard className="w-4 h-4" />
                                        <span>{userData.keyboard || 'No keyboard set'}</span>
                                    </div>
                                </div>
                                
                                <p className="mt-4 text-text/80">
                                    {userData.bio || 'No bio yet'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Statistiques principales */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button 
                            onClick={() => setShowStatsModal('wpm')}
                            className="text-left"
                        >
                            <StatCard 
                                title="Average WPM" 
                                value={`${userStatistics?.averageWpm?.toFixed(1) || '0'} WPM`} 
                            />
                        </button>
                        <button 
                            onClick={() => setShowStatsModal('accuracy')}
                            className="text-left"
                        >
                            <StatCard 
                                title="Average Accuracy" 
                                value={`${userStatistics?.averageAccuracy?.toFixed(1) || '0'}%`}
                            />
                        </button>
                        <button 
                            onClick={() => setShowStatsModal('errors')}
                            className="text-left"
                        >
                            <StatCard 
                                title="Average Errors" 
                                value={userStatistics?.averageErrors?.toFixed(1) || '0'} 
                            />
                        </button>
                        <StatCard 
                            title="Total Games" 
                            value={userStatistics?.totalGames || '0'} 
                        />
                    </div>

                    {/* Statistiques détaillées */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-secondary/40 backdrop-blur-sm rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-text mb-4">Detailed Statistics</h2>
                            <div className="space-y-4">
                                <StatCard 
                                    title="Total Characters" 
                                    value={userStatistics?.totalCharacters?.toLocaleString() || '0'} 
                                />
                                <StatCard 
                                    title="Total Errors" 
                                    value={userStatistics?.totalErrors?.toLocaleString() || '0'} 
                                />
                                <StatCard 
                                    title="Average Errors" 
                                    value={userStatistics?.averageErrors?.toFixed(1) || '0'} 
                                />
                            </div>
                        </div>
                        
                        <div className="bg-secondary/40 backdrop-blur-sm grid grid-cols-2 gap-4 rounded-xl p-6">
                            <div className="flex flex-col gap-2 bg-tertiary/40 rounded-xl p-4">
                                <h2 className="text-xl font-semibold text-text mb-4">Prefered Length Parameter</h2>
                                <p className="text-text">{userStatistics?.preferedLengthParameter || 'N/A'}</p>
                            </div>
                            <div className="flex flex-col gap-2 bg-tertiary/40 rounded-xl p-4">
                                <h2 className="text-xl font-semibold text-text mb-4">Prefered Sentence Parameter</h2>
                                <p className="text-text">{userStatistics?.preferedSentenceParameter || 'N/A'}</p>
                            </div>
                            <div className="space-y-4 bg-tertiary/40 rounded-xl p-4 flex col-span-2 flex-col gap-2">
                                <h2 className="text-xl font-semibold text-text mb-4">Achievements</h2>

                                {userData.badges && userData.badges.length > 0 ? (
                                    userData.badges.map((badge, index) => (
                                        <div key={index} className="flex items-center gap-2 text-text">
                                            <CiMedal className="w-5 h-5 text-accent" />
                                            <span>{badge}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-text_secondary">No badges earned yet</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {isEditing && <EditProfileModal />}

                    {showStatsModal && (
                        <StatsModal
                            onClose={() => setShowStatsModal(null)}
                            title={
                                showStatsModal === 'wpm' 
                                    ? 'WPM History' 
                                    : showStatsModal === 'accuracy' 
                                    ? 'Accuracy History' 
                                    : 'Errors History'
                            }
                            data={userStatistics as StatisticsData}
                            defaultMetric={showStatsModal}
                        />
                    )}
                </div>
            ) : (
                <div className="h-full w-full font-bold text-5xl text-text flex justify-center items-center text-center">
                    User not found <br /> (ㅠ﹏ㅠ)
                </div>
            )}
        </LoadableWrapper>
    )
}


export default Profile