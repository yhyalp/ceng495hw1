import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  seller: String,
  image: String,
  category: String,
  batteryLife: Number, // For GPS Watches
  age: Number, // For antiques and vinyls
  size: String, // For shoes
  material: String, // For furniture and shoes
  ratings: [{ user: String, rating: Number }],
  reviews: [{ user: String, review: String }],
});

export default mongoose.models.Item || mongoose.model("Item", ItemSchema);
