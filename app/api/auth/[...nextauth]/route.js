import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialProvider from 'next-auth/providers/credentials';
require('dotenv').config();
import User from '@models/User';
import dbConnection from '@utils/mongodb'
import dbConnect from '@utils/dbConnect';
import MongooseAdapter from '@utils/adapter/mongoose-adapter';
import DiscordProvider from 'next-auth/providers/discord';

const bcrypt = require('bcrypt');


const handler = NextAuth({

    providers: [
        GoogleProvider({
            name: "Google",
            id: "google",
            type: "oauth",
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,

            profile: (profileData) => {
                return {
                    id: profileData?.sub,
                    name: profileData?.name,
                    email: profileData?.email,
                    image: profileData?.picture,
                };
            },

        }),

        DiscordProvider({
            name: "Discord",
            id: "discord",
            type: "oauth",
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,

            profile: (profileData) => {
                return {
                    id: profileData?.id,
                    name: profileData?.username,
                    email: profileData?.email,
                    image: 'https://cdn.discordapp.com/avatars/' + profileData?.id + '/' + profileData?.avatar + '.png',
                };
            },
        }),


        CredentialProvider({
            name: "credentials",

            credentials: {
                email: { type: "email", placeholder: "Email" },
                password: { type: "password", placeholder: "Password" }
            },

            async authorize(credentials, _req) {
                try {
                    const { email, password } = credentials;
                    await dbConnect();
                    const userExists = await User.findOne({ email: email })
                    if (!userExists) {
                        console.log("incorrect email or password")
                        throw new Error("User does not exist");
                    }

                    if (!(bcrypt.compareSync(password, userExists.password)) || userExists.email !== email) {

                        throw new Error("Incorrect email or password");
                    }
                    return userExists;

                } catch (error) {
                    throw new Error(error.message);
                }
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    secret: process.env.NEXTAUTH_SECRET,

    pages: {
        signIn: "/auth/login",
    },

    adapter: MongooseAdapter(dbConnection),

    callbacks: {

        jwt: ({ token, user }) => {
            if (user) {
                token.id = user._id;
            }
            return token;
        },
        session: ({ session, token }) => {
            if (token) {
                session.user.id = token.id;
                console.log(session.user.id)
            }
            return session;
        }
    }
});


export { handler as GET, handler as POST }

