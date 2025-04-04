// /models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }, // Store hashed passwords in production
  isAdmin: { type: Boolean, default: false }, // Add isAdmin field
  ratings: [{ itemId: mongoose.Schema.Types.ObjectId, rating: Number }],
  reviews: [{ itemId: mongoose.Schema.Types.ObjectId, review: String }],
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
