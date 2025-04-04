import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Rating from "@/models/Rating";
import User from "@/models/User";

export async function GET(req, { params }) {
  await connectDB();
  const userId = params.id; // Extract userId

  try {
    console.log(`🔍 Fetching ratings for user: ${userId}`);

    // Ensure the userId is valid before querying
    if (!userId || userId.length !== 24) {
      console.error("Invalid userId format:", userId);
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Fetch ratings and populate user details
    const ratings = await Rating.find({ userId }).populate("userId", "username");
    
    console.log("Fetched Ratings:", ratings); // Debugging log

    if (!ratings.length) {
      return NextResponse.json({ averageRating: null, ratings: [] });
    }

    // Calculate average rating
    const averageRating =
      ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    return NextResponse.json({
      averageRating: averageRating.toFixed(1),
      ratings, // Includes username
    });
  } catch (error) {
    console.error("Error fetching user ratings:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const deletedRating = await Rating.findByIdAndDelete(id);
    if (!deletedRating) return NextResponse.json({ error: "Rating not found" }, { status: 404 });

    return NextResponse.json({ message: "Rating deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete rating" }, { status: 500 });
  }
}
