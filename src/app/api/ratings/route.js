import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";  
import Rating from "@/models/Rating"; 
import Item from "@/models/Item"; 
import User from "@/models/User"; 

export async function POST(req) {
  try {
    console.log("📩 Incoming request to /api/ratings");

    // Connect to MongoDB
    await connectDB();

    // Read request body
    const body = await req.json();
    console.log("🔍 Received Data:", body);

    const { itemId, userId, rating } = body;

    // Validate input
    if (!itemId || !userId || rating === undefined) {
      console.error("Missing required fields", { itemId, userId, rating });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if the user already rated this item
    const existingRating = await Rating.findOne({ itemId, userId });

    if (existingRating) {
      // Update the existing rating
      existingRating.rating = rating;
      await existingRating.save();
      console.log("Rating updated successfully:", existingRating);
    } else {
      // Create a new rating if none exists
      const newRating = new Rating({ itemId, userId, rating });
      await newRating.save();
      console.log("New rating created:", newRating);

      // Link the rating to the item
      await Item.findByIdAndUpdate(itemId, {
        $push: { ratings: newRating._id },
      });

      // Link the rating to the user
      await User.findByIdAndUpdate(userId, {
        $push: { ratings: newRating._id },
      });
    }

    return NextResponse.json({ message: "Rating submitted successfully" }, { status: 201 });

  } catch (error) {
    console.error("Error in /api/ratings:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();

  try {
    const reviews = await Rating.find().populate("userId", "username"); // Fetch username

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}