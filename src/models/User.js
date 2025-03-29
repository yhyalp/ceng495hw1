import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: String,
  password: String, // Store hashed passwords for security
  role: { type: String, enum: ["admin", "user"], default: "user" },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
