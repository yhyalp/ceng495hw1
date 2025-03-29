import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    console.log("Request received for user:", username);

    try {
      await connectDB();

      // Check if the user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        console.log("User already exists:", username);
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);
      console.log("Password hashed");

      // Create a new user
      const user = new User({
        username,
        password: hashedPassword,
      });

      // Save the user to the database
      await user.save();
      console.log("User registered successfully");

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
