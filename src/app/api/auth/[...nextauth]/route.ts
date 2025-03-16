import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
      async profile(profile) {
        await connectDB();
        const user = await User.findOne({ email: profile.email });

        if (!user) {
          const now = new Date();
          const formattedDate = `${now.getDate()}${now.getMonth() + 1}${now.getFullYear()}`;
          const formattedTime = `${now.getHours()}${now.getMinutes()}${now.getSeconds()}${now.getMilliseconds()}`;
          const username = `${profile.email.split("@")[0]}${formattedDate}${formattedTime}`;

          const newUser = await User.create({
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            username,
            password: null,
            dateOfBirth: null,
            gender: null,
            emailVerified: "verified",
            bio: null,
            others: {},
          });

          return { id: newUser._id, email: newUser.email, name: newUser.name };
        }

        return { id: user._id, email: user.email, name: user.name };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials?.email }).select("+password");

        if (!user) throw new Error("User not found");

        const isValidPassword = await bcrypt.compare(credentials!.password, user.password!);
        if (!isValidPassword) throw new Error("Invalid credentials");

        return { id: user._id, email: user.email, name: user.name };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      await connectDB();
      const user = await User.findOne({ email: session.user.email });

      if (user) {
        session.user = user;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/google-add-info",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
