import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });

    if (user) {
      return res.status(200).json({ message: "Login successful", user });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  }
}
