import User from '/models/user';
import dbConnect from '@utils/dbConnect';

const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;


export async function POST(request) {

    const { name, email, password } = await request.json();

    try {
        await dbConnect();
        const userExists = await User.findOne({ email: email })
        if (!userExists) {

            console.log("user does not exist")

            const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
            const hash = bcrypt.hashSync(password, salt);
        

            await User.create({
                name: name,
                email: email,
                password: hash,
                image: 'default.svg',
                isAdmin: false,
                isVerified: false,
                averageWPM: 0,
                averageAccuracy: 0,
                averageErrors: 0,
                totalGamesPlayed: 0,
            });

            return new Response("User created", { status: 201 });
        } else {
            console.log("user already exists")
            return new Response("User already exists", { status: 200 }); 
        }


    } catch (error) {
        console.log(error);
        return new Response("An error occurred", { status: 500 });
    }
}

