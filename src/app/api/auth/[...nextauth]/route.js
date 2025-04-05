import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials.username || !credentials.password) {
          throw new Error("Username and password are required");
        }
        console.log("Received credentials:", credentials);
      
        await connectDB();
        
        const user = await User.findOne({ username: credentials.username });
        if (!user) {
          console.log("User not found:", credentials.username);
          throw new Error("User not found");
        }
      
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          console.log("Invalid credentials for user:", credentials.username);
          throw new Error("Invalid credentials");
        }
      
        console.log("User authenticated:", user.username, "Is Admin:", user.isAdmin);
      
        return { 
          id: user._id, 
          username: user.username, 
          isAdmin: user.isAdmin
        };
      }
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
