import User from '/models/user';
import { connectToDatabase } from "@utils/mongodb";

const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

export async function POST(request) {
    const { name, email, password, image } = await request.json();

    try {
        await connectToDatabase();
        const userExists = await User.findOne({ email: email })
        if (!userExists) {

            const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
            const hash = bcrypt.hashSync(password, salt);

            await User.create({
                name: name,
                email: email,
                password: hash,
                image: image,
                isAdmin: false,
                isVerified: false,
                averageWPM: 0,
                averageAccuracy: 0,
                averageErrors: 0,
                totalGamesPlayed: 0,
            });

            return new Response("User created", { status: 201 });
        } else {
            if(validateUser(password, userExists.password)){
                console.log("passed")
                return new Response("User already exists", { status: 200 });

            } else {
                return new Response("Incorrect password", { status: 401 });
            }
            
        }


    } catch (error) {
        console.log(error);
        return new Response("An error occurred", { status: 500 });
    }
}

function validateUser(password, hash){
    return bcrypt.compareSync(password, hash);
}