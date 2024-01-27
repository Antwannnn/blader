import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialProvider from 'next-auth/providers/credentials';
require('dotenv').config();
import User from '/models/user';
import clientPromise from '@utils/mongodb';
import dbConnect from '@utils/dbConnect';
import { MongoDBAdapter } from '@auth/mongodb-adapter';

const bcrypt = require('bcrypt');


const handler = NextAuth({

    providers: [
        GoogleProvider({
            name: "Google",
            id: "google",
            type: "oauth",
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,

            async jwt(token, _user, account, _profile, _isNewUser) {
                if (account?.accessToken) {
                    token.accessToken = account.accessToken;
                }
                return token;
            },

        }),
        CredentialProvider({
            name: "credentials",

            credentials: {
                email: {  type: "email", placeholder: "Email" },
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

                }
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },
    
    pages: {
        signIn: "/auth/login",
    },

    adapter: MongoDBAdapter(clientPromise),
});


export { handler as GET, handler as POST }

