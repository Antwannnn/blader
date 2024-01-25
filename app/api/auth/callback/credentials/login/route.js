import User from '/models/user';
import { connectToDatabase } from "@utils/mongodb";

const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

// Login logic


export async function POST(request) {

    const { email, password } = await request.json();

    try {
        await connectToDatabase();
        const userExists = await User.findOne({ email: email });
        if (!userExists) {
            return new Response("User does not exist", { status: 401 });
            
        } else {
            const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
            const hash = bcrypt.hashSync(password, salt);
            
            if(validateUser(password, hash)){
                return new Response("Connection successful", { status: 200 });
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

