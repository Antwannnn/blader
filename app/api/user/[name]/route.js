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
            return new Response(JSON.stringify({ user }), {
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