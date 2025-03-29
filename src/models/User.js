import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: String,
  password: String, // Store hashed passwords in production
  isAdmin: Boolean,
  ratings: [{ itemId: mongoose.Schema.Types.ObjectId, rating: Number }],
  reviews: [{ itemId: mongoose.Schema.Types.ObjectId, review: String }],
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
