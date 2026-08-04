import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({                 // Configure the credentials provider, here provider is credentials, which means we are using email and password for authentication
      name: "credentials",

      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        await connectDB();

        const { email, password } = credentials;

        if (!email || !password) {
          return null;
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
          email: normalizedEmail,
        });

        if (!user) {
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(
          password,
          user.password
        );

        if (!isPasswordCorrect) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",       // Use JWT for session management, JWT is a stateless authentication mechanism that allows the server to verify the authenticity of the token without storing session data on the server.
  },

  callbacks: {            // Callbacks are functions that are called at specific points in the authentication flow, allowing you to customize the behavior of NextAuth.(NextAuth provides several built-in callbacks that you can use to modify the authentication flow, such as signIn, redirect, session, and jwt.Nexauth is a powerful authentication library for Next.js that provides a simple and flexible way to handle authentication in your application.)
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;       // this session will be available in the client-side, and it will contain the user information along with the token id. session is cookie based, and it will be sent to the client-side, where it can be accessed using the useSession hook provided by NextAuth.
    },
  },

  pages: {
    signIn: "/login",   // this is the custom login page that we will create in the next step. NextAuth will redirect the user to this page when they try to access a protected route without being authenticated.
  },

  secret: process.env.AUTH_SECRET,
});