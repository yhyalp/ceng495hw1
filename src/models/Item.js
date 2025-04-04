import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  seller: String,
  category: String, // New field to store the item type
  image: String,
  batteryLife: Number, // GPS watches only
  age: Number, // Antique furniture, vinyls only
  size: String, // Running shoes only
  material: String, // Furniture & shoes only
  ratings: { type: Object, default: {} }, 
  rating: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

export default mongoose.models.Item || mongoose.model("Item", ItemSchema);