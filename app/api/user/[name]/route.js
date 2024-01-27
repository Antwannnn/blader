import dbConnect from '@utils/dbConnect';
import User from '@models/user';

export const GET = async (request, { params }) => {
    try{

        await dbConnect();

        const user = await User.findOne({ name: params.name });

        if(!user){
            return new Response(JSON.stringify({ error: 'User not found.' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 404,
            });
        } else{

            console.log(JSON.stringify({ user }));

            return new Response(JSON.stringify({ user }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200,
            });
        }

    }catch(error){
        
    }

}