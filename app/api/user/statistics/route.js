import UserStatistics from "@models/UserStatistics";
import dbConnect from "@utils/dbConnect";

export async function GET() {
    try {
        await dbConnect();
        
        const leaderboard = await UserStatistics.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userRef",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $group: {
                    _id: "$userRef",
                    name: { $first: "$user.name" },
                    image: { $first: "$user.image" },
                    maxWpm: { $max: "$wpm" },
                    averageWpm: { $avg: "$wpm" },
                    averageAccuracy: { $avg: "$accuracy" },
                    gamesPlayed: { $sum: 1 }
                }
            },
            {
                $match: {
                    gamesPlayed: { $gte: 100 }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    image: 1,
                    maxWpm: { $round: ["$maxWpm", 2] },
                    averageWpm: { $round: ["$averageWpm", 2] },
                    averageAccuracy: { $round: ["$averageAccuracy", 2] },
                    gamesPlayed: 1
                }
            },
            { $sort: { averageWpm: -1 } },
            { $limit: 100 }
        ]);

        return new Response(JSON.stringify(leaderboard), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.error("Error in leaderboard route:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}