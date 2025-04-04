import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Item from "@/models/Item";
import Rating from "@/models/Rating";  // Import the Rating model
import Review from "@/models/Review";  // Import the Review model

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const userId = params.id;
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete user's ratings and reviews from the database
    await Rating.deleteMany({ userId });
    await Review.deleteMany({ userId });

    // Remove user from items' ratings and reviews arrays
    await Item.updateMany(
      {}, 
      { 
        $pull: { 
          ratings: userId, 
          reviews: userId 
        } 
      }
    );

    // Delete the user
    await User.findByIdAndDelete(userId);
    
    return NextResponse.json({ message: "User and related ratings/reviews deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}

export async function GET(req, context) {
  await connectDB();
  const userId = context.params.id; // Get user ID from request params

  try {
    const ratings = await Rating.find({ userId }); // Get ratings given by user

    if (!ratings.length) {
      return NextResponse.json({ averageRating: null, ratings: [] });
    }

    // Calculate average rating
    const averageRating =
      ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    return NextResponse.json({
      averageRating: averageRating.toFixed(1),
      ratings,
    });
  } catch (error) {
    console.error("Error fetching user ratings:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}