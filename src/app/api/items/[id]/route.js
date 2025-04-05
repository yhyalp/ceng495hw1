import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Item from "@/models/Item";
import Rating from "@/models/Rating"; // Import the Rating model
import Review from "@/models/Review"; // Import the Review model

export async function DELETE(req, context) {
  try {
    await connectDB();

    const id = context.params.id;

    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Delete all ratings and reviews related to the item
    await Rating.deleteMany({ itemId: id });
    await Review.deleteMany({ itemId: id });

    return NextResponse.json({ message: "Item and its ratings/reviews deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}


// Rate or Review an item
export async function POST(req, { params }) {
  await connectDB();
  const { id } = params;
  const { userId, rating, review } = await req.json();

  try {
    const item = await Item.findById(id);
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    if (!Array.isArray(item.ratings)) {
      item.ratings = [];
    }
    if (!Array.isArray(item.reviews)) {
      item.reviews = [];
    }

    // Update Rating
    if (rating !== undefined) {
      const existingRating = item.ratings.find((r) => r.userId === userId);
      if (existingRating) {
        existingRating.value = rating;
      } else {
        item.ratings.push({ userId, value: rating });
      }
      item.averageRating = item.ratings.reduce((sum, r) => sum + r.value, 0) / item.ratings.length;
    }

    // Update or Add Review
    if (review !== undefined) {
      const existingReview = item.reviews.find((r) => r.userId === userId);
      if (existingReview) {
        existingReview.text = review;
      } else {
        item.reviews.push({ userId, text: review });
      }
    }

    await item.save();

    return NextResponse.json({ message: "Rating/Review updated!", averageRating: item.averageRating });
  } catch (error) {
    console.error("Error in POST /api/items/[id]:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req, context) {
  await connectDB();
  const id = await context.params.id; // Access params asynchronously

  try {
    const item = await Item.findById(id)
      .populate("ratings") // Populate the ratings array

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Calculate average rating
    const ratings = await Rating.find({ itemId: id });
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : null;
      
        return NextResponse.json({ 
          ...item.toObject(), 
          averageRating  // Include averageRating in response
        });
  } catch (error) {
    console.error("Error fetching item:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}