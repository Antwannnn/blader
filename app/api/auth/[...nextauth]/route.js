import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import User from '@models/user';
import { redirect } from 'next/dist/server/api-utils';

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],

    callbacks: {

        async session( {session} ) {
            const sessionUser = await User.findOne({email: session.user.email});
            session.user.id = sessionUser._id.toString();

            return session;
        },

        async signIn({ user, account }) {

            console.log(user);
            if (account.provider === 'google') {

                try {
                    const res = await fetch('http://localhost:3000/api/user', {
                        method: 'POST',
                        body: JSON.stringify(user),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    });

                    if (res.ok) {
                        return user;
                    } else if(res.status === 200){
                        return user;
                    }

                } catch (error) {
                    console.log(error);
                }
            }
        },
        async redirect({url, baseUrl}){
            return baseUrl;
        }
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }