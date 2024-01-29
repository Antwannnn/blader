import User from '@models/User';
import dbConnect from '@utils/dbConnect';

const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

export async function POST(request, response) {

    const { name, email, password } = await request.json();

    await dbConnect();
    const userExistsByEmail = await User.findOne({ email: email })
    const userExistsByName = await User.findOne({ name: name })

    if (!userExistsByEmail) {
        if (!userExistsByName) {
            const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
            const hash = bcrypt.hashSync(password, salt);

            await User.create({
                name: name,
                email: email,
                password: hash,
            });

            return new Response(JSON.stringify({ success: 'Account created successfully.' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200,
            });

        } else {
            return new Response(JSON.stringify({ error: 'The username you specified is already linked to an account.' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 201,
            });
        }
    } else {
        return new Response(JSON.stringify({ error: 'The email you specified is already linked to an account.' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 202,
        });
    }
}

