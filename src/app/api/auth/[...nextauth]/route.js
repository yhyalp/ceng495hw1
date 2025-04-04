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
          isAdmin: user.isAdmin // Ensure this is included
        };
      }
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;  // Ensure user id is passed
        token.username = user.username;  // Ensure username is passed
        token.isAdmin = user.isAdmin;  // Ensure role is passed
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id;  // Assign user id
        session.user.username = token.username;  // Assign username
        session.user.isAdmin = token.isAdmin;  // Assign role
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
