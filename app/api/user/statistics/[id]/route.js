import dbConnect from '@utils/dbConnect';
import UserStatistics from '@models/UserStatistics';

export const GET = async (request, { params }) => {
    try {

        await dbConnect();

        const statistics = await UserStatistics.find({ _id: params.id });

        if (!statistics) {
            return new Response(JSON.stringify({ error: 'User not found.' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 404,
            });
        } else {

            const averageWpm = statistics.reduce((acc, curr) => acc + curr.wpm, 0) / statistics.length;
            const averageAccuracy = statistics.reduce((acc, curr) => acc + curr.accuracy, 0) / statistics.length;
            const averageErrors = statistics.reduce((acc, curr) => acc + curr.totalErrors, 0) / statistics.length; 

            const totalWords = statistics.reduce((acc, curr) => acc + curr.totalWords, 0);
            const totalErrors = statistics.reduce((acc, curr) => acc + curr.totalErrors, 0);
            const totalCharacters = statistics.reduce((acc, curr) => acc + curr.totalCharacters, 0);
            const totalGames = statistics.length;

            const processedStatistics = { averageWpm, averageAccuracy, averageErrors, totalWords, totalErrors, totalCharacters, totalGames };

            return new Response(JSON.stringify({ processedStatistics }), {
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


export const PUT = async (request, { params }) => {
    try {

        await dbConnect();

        const { _id, wpm, accuracy, totalWords, totalErrors, totalCharacters } = request.body;

        const created = await UserStatistics.create({ _id: _id }, { 
            wpm: wpm, 
            accuracy: accuracy, 
            totalErrors: totalWords, 
            totalCharacters: totalCharacters, 
            totalErrors: totalErrors 
        });

        if(created) {
            return new Response(JSON.stringify({ created }), {
                headers: { 'Content-Type': 'application/json' },
                status: 201,
            });
        } else {
            return new Response(JSON.stringify({ error: 'An error occurred' }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    status: 500,
                });
        }
        
    }
    catch (error) {

    }
}