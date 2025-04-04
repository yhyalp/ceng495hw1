// /models/Rating.js
import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  rating: { type: Number, required: true, min: 1, max: 10 },
});

export default mongoose.models.Rating || mongoose.model("Rating", ratingSchema);
