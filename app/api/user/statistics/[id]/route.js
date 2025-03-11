import UserStatistics from '@models/UserStatistics';
import dbConnect from '@utils/dbConnect';

export const GET = async (request, { params }) => {
    try {
        await dbConnect();

        console.log(params['id']);

        const statistics = await UserStatistics.find({ userRef: params['id'] })
            .sort({ createdAt: 1 });

        if (!statistics) {
            return new Response(JSON.stringify({ error: 'User not found.' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 404,
            });
        } else {

            const averageWpm = statistics.reduce((acc, curr) => acc + curr.wpm, 0) / statistics.length;
            const averageAccuracy = statistics.reduce((acc, curr) => acc + curr.accuracy, 0) / statistics.length;
            const averageErrors = statistics.reduce((acc, curr) => acc + curr.totalErrors, 0) / statistics.length;

            const wpmOverTime = statistics.map((stat, index) => ({
                wpm: stat.wpm,
                createdAt: stat.createdAt,
                index: index,
            }));
            const accuracyOverTime = statistics.map((stat, index) => ({
                accuracy: stat.accuracy,
                createdAt: stat.createdAt,
                index: index,
            }));

            const errorsOverTime = statistics.map((stat, index) => ({
                errors: stat.totalErrors,
                createdAt: stat.createdAt,
                index: index,
            }));

            const totalWords = statistics.reduce((acc, curr) => acc + curr.totalWords, 0);
            const totalErrors = statistics.reduce((acc, curr) => acc + curr.totalErrors, 0);
            const totalCharacters = statistics.reduce((acc, curr) => acc + curr.totalCharacters, 0);
            const totalGames = statistics.length;
            const maxWpm = statistics.reduce((acc, curr) => Math.max(acc, curr.wpm), 0);
            const maxAccuracy = statistics.reduce((acc, curr) => Math.max(acc, curr.accuracy), 0);

            const preferedLengthParameter = getPreferedLengthParameter(statistics);
            const preferedSentenceParameter = getPreferedSentenceParameter(statistics);
        
            return new Response(JSON.stringify({ averageWpm, averageAccuracy, averageErrors, wpmOverTime, accuracyOverTime, errorsOverTime, totalWords, totalErrors, totalCharacters, totalGames, preferedLengthParameter, preferedSentenceParameter, maxWpm, maxAccuracy }), {
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

function getPreferedLengthParameter(statistics) {
    if(statistics.length === 0) {
        return "-";
    }
    
    // Compter la fréquence de chaque paramètre de longueur
    const lengthFrequency = statistics.reduce((acc, stat) => {
        const length = stat.lengthParameter;
        acc[length] = (acc[length] || 0) + 1;
        return acc;
    }, {});

    // Trouver le paramètre le plus fréquent
    const mostFrequent = Object.entries(lengthFrequency)
        .reduce((max, [length, count]) => 
            count > max.count ? { length, count } : max,
            { length: "-", count: 0 }
        );

    return mostFrequent.length;
}

function getPreferedSentenceParameter(statistics) {
    if(statistics.length === 0) {
        return "-";
    }
    
    // Compter la fréquence de chaque type de phrase
    const sentenceFrequency = statistics.reduce((acc, stat) => {
        const type = stat.sentenceParameter;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    // Trouver le type le plus fréquent
    const mostFrequent = Object.entries(sentenceFrequency)
        .reduce((max, [type, count]) => 
            count > max.count ? { type, count } : max,
            { type: "-", count: 0 }
        );

    return mostFrequent.type;
}

export const POST = async (request, { params }) => {
    try {
        await dbConnect();

        const body = await request.json();
        const { _id, wpm, accuracy, totalWords, totalErrors, totalCharacters, lengthParameter, sentenceParameter } = body;

        const created = await UserStatistics.create({ 
            userRef: params['id'],
            wpm, 
            accuracy, 
            totalWords, 
            totalCharacters, 
            totalErrors,
            sentenceParameter,
            lengthParameter,
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
        console.log(error);
        return new Response(JSON.stringify({ message: 'An error occurred' + error }),
            {
                headers: { 'Content-Type': 'application/json' },
                status: 500,
            });
    }
}