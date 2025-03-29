import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  seller: String,
  image: String,
  category: String,
  batteryLife: Number, // Only for watches
  age: Number, // Only for antique furniture and vinyls
  size: String, // Only for shoes
  material: String, // Only for furniture and shoes
  rating: { type: Number, default: 0 },
  reviews: [{ username: String, review: String }],
});

export default mongoose.models.Item || mongoose.model("Item", ItemSchema);
