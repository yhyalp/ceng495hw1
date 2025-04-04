// /pages/api/users/[id].js
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export default async function handler(req, res) {
  const { id } = req.query; // Get the user ID from the query parameters

  try {
    await connectDB();
    const user = await User.findById(id); // Fetch user by ID from MongoDB

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user data as JSON
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
