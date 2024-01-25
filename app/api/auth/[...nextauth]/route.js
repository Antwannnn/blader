import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialProvider from 'next-auth/providers/credentials';
require('dotenv').config();
import User from '/models/user';
import { connectToDatabase } from "@utils/mongodb";

const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,

            async session({ session }) {
                const sessionUser = await User.findOne({ email: session.user.email });
                session.user.id = sessionUser._id.toString();

                return session;
            },

            async signIn({ user, account }) {

                console.log(credentials);
                console.log(user);

                const { id, name, email, image } = user;

                try {
                    if (account.provider === 'google') {
                        const res = await fetch('http://localhost:3000/api/user', {
                            method: 'POST',
                            body: JSON.stringify({
                                name,
                                email,
                                password: id,
                                image
                            }),
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        });

                        if (res.ok) {
                            return user;
                        } else if (res.status === 200) {
                            return user;
                        }
                    }


                } catch (error) {
                    console.log(error);
                }

            },
        }),

        CredentialProvider({
            name: "credentials",
            credentials: {
                email: { type: "email" },
                password: { type: "password"},
            },

            async session({ session }) {
                const sessionUser = await User.findOne({ email: session.user.email });
                session.user.id = sessionUser._id.toString();

                return session;
            },

            async authorize(credentials) {

                console.log(credentials)

                function validateUser(password, hash) {
                    return bcrypt.compareSync(password, hash);
                }

                const userInputs = {
                    email: credentials.email,
                    password: credentials.password,
                };

                try {
                    await connectToDatabase();
                    const userExists = await User.findOne({ email: userInputs.email });
                    if (!userExists) {
                        return new Response("User does not exist", { status: 401 });

                    } else {
                        const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
                        const hash = bcrypt.hashSync(userInputs.password, salt);

                        if (validateUser(userInputs.password, hash)) {
                            return {
                                id: userExists._id,
                                name: userExists.name,
                                email: userExists.email
                            }
                        } else{
                            console.log("incorrect password");
                            return new Response("Incorrect password", { status: 401 });
                        }
                    }

                    return null;

                } catch (error) {
                    console.log(error);
                    return new Response("An error occurred", { status: 500 });
                }
            },
        }),

    ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }