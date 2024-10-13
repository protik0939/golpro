import client from "@/lib/db"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: MongoDBAdapter(client),
    providers: [
        Credentials({
            async authorize(credentials) {
                let user = null;

                user = {
                    id: '0939',
                    name: 'Sadat Alam Protik',
                    email: 'protik0939@gmail.com',
                }
                if (!user) {
                    console.log('Invalid user', credentials);
                    return null;
                }
                return user;
            }
        }),
        Google
    ],
})