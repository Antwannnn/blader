import User from '@models/User';
import dbConnect from '@utils/dbConnect';
import { cache } from 'react';

export const GET = cache(async (request, { params }) => {
    try {

        await dbConnect();

        const user = await User.findById(params.id);

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

}); 

export const PUT = cache(async (request, { params }) => {
    try {
        const { bio, keyboard, avatar } = await request.json();
        console.log(bio, keyboard, avatar);

    await dbConnect();

    const user = await User.findOneAndUpdate({ name: params.id}, { bio, keyboard, avatar });

    return new Response(JSON.stringify({ message: 'Profile updated' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'An error occurred' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
});