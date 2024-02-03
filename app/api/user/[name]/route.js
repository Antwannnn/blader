import dbConnect from '@utils/dbConnect';
import User from '@models/User';
import UserStatistics from '@models/UserStatistics';

export const GET = async (request, { params }) => {
    try {

        await dbConnect();

        const user = await User.findOne({ name: params.name });

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found.' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 404,
        });
        } else {
            const userStatistics = await UserStatistics.findOne({ user: user._id });
            if(!userStatistics){
                return new Response(JSON.stringify({body: user, error: 'User has no statistics.' }), {
                    headers: { 'Content-Type': 'application/json' },
                    status: 402,
                });
            }
            const averages = averages(userStatistics);
            const totals = totals(userStatistics);
            const userWithStatistics = { ...user._doc, averages, totals }; 
            return new Response(JSON.stringify({ userWithStatistics }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200,
            });
        }

    } catch (error) {
        return new Response(JSON.stringify({ error: 'An error occurred' }),
            {
                headers: { 'Content-Type': 'application/json' },
                status: 500,
            });
    }

}

const totals = (userStatistics) => {
    const totalWords = userStatistics.reduce((acc, curr) => acc + curr.totalWords, 0);
    const totalErrors = userStatistics.reduce((acc, curr) => acc + curr.totalErrors, 0);
    const totalCharacters = userStatistics.reduce((acc, curr) => acc + curr.totalCharacters, 0);
    const totalGames = userStatistics.length;

    return { totalWords, totalErrors, totalCharacters, totalGames };

}

const averages = (userStatistics) => {
    const averageWpm = userStatistics.reduce((acc, curr) => acc + curr.wpm, 0) / userStatistics.length;
    const averageAccuracy = userStatistics.reduce((acc, curr) => acc + curr.accuracy, 0) / userStatistics.length;
    const averageErrors = userStatistics.reduce((acc, curr) => acc + curr.totalErrors, 0) / userStatistics.length;
    return { averageWpm, averageAccuracy, averageErrors };
}


export const PUT = async (request, { params }) => {
    try {

        const { name } = params;
        const { user } = request;
        const { body } = request;

        await dbConnect();

        const userExists = await User.findOne({ name: name });

        if (!userExists) {
            return new Response(JSON.stringify({ error: 'User not found.' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 404,
            });
        } else if (userExists._id.toString() !== user.id) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 401,
            });
        } else {
            const updatedUser = await User.findOneAndUpdate({ name: name }, body, { new: true });
            return new Response(JSON.stringify({ user: updatedUser }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200,
            });
        }

    }
    catch (error) {
        return new Response(JSON.stringify({ error: 'An error occurred' }),
            {
                headers: { 'Content-Type': 'application/json' },
                status: 500,
            });
    }
}
