// /models/Review.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  text: { type: String, required: true },
});

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);
