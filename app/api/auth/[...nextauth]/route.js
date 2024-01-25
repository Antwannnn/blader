import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
require('dotenv').config();
import User from '/models/user';

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),

        CredentialsProvider({
            credentials: {
                name: {},
                email: {},
                password: {},
            },
        }),

    ],

    callbacks: {

        async session({ session }) {
            const sessionUser = await User.findOne({ email: session.user.email });
            session.user.id = sessionUser._id.toString();

            return session;
        },

        async signIn({ user, profile, account }) {

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

                } else {

                    console.log(credentials)

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
        async redirect({ url, baseUrl }) {
            return baseUrl;
        }
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }