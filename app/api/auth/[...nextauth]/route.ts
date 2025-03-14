import User from '@models/User';
import MongooseAdapter from '@utils/adapter/mongoose-adapter';
import dbConnect from '@utils/dbConnect';
import dbConnection from '@utils/mongodb';
import bcrypt from 'bcryptjs';
import NextAuth, { NextAuthOptions, Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';
require('dotenv').config();

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            name: "Google",
            id: "google",
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',

            profile: (profileData) => {
                return {
                    id: profileData.sub,
                    name: profileData.name,
                    email: profileData.email,
                    image: profileData.picture,
                };
            },
        }),

        DiscordProvider({
            name: "Discord",
            id: "discord",
            clientId: process.env.DISCORD_CLIENT_ID || '',
            clientSecret: process.env.DISCORD_CLIENT_SECRET || '',

            profile: (profileData) => {
                return {
                    id: profileData.id,
                    name: profileData.username,
                    email: profileData.email,
                    image: `https://cdn.discordapp.com/avatars/${profileData.id}/${profileData.avatar}.png`,
                };
            },
        }),

        CredentialsProvider({
            name: "credentials",

            credentials: {
                email: { type: "email", placeholder: "Email" },
                password: { type: "password", placeholder: "Password" }
            },

            async authorize(credentials, _req) {
                if (!credentials) return null;
                
                try {
                    const { email, password } = credentials;
                    await dbConnect();
                    const userExists = await User.findOne({ email: email });
                    if (!userExists) {
                        console.log("incorrect email or password");
                        throw new Error("User does not exist");
                    }

                    if (!(bcrypt.compareSync(password, userExists.password)) || userExists.email !== email) {
                        throw new Error("Incorrect email or password");
                    }
                    return userExists;

                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(error.message);
                    }
                    throw new Error("An unexpected error occurred");
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
                token.id = user.id;
            }
            return token;
        },
        session: ({ session, token }: { session: Session; token: JWT }) => {
            if (token) {
                session.user.id = token.id as string;
            }
            return session;
        }
    }
};


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

