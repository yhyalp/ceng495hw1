import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import Item from "@/models/Item";
import User from "@/models/User";

export async function POST(req) {
  try {
    console.log("📩 Incoming request to /api/reviews");

    // Connect to MongoDB
    await connectDB();

    // Read request body
    const body = await req.json();
    console.log("🔍 Received Data:", body);

    const { itemId, userId, text } = body;

    // Validate input
    if (!itemId || !userId || !text) {
      console.error("Missing required fields", { itemId, userId, text });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch the user's username
    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found:", userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the user already has a review for this item
    const existingReview = await Review.findOne({ itemId, userId });

    if (existingReview) {
      console.log("Existing review found, deleting old review:", existingReview._id);

      // Remove old review from database
      await Review.findByIdAndDelete(existingReview._id);

      // Update Item document to remove old review ID
      await Item.findByIdAndUpdate(itemId, {
        $pull: { reviews: existingReview._id },
      });

      // Update User document to remove old review ID
      await User.findByIdAndUpdate(userId, {
        $pull: { reviews: existingReview._id },
      });
    }

    // Create the new review, including the username
    const newReview = new Review({
      itemId,
      userId,
      text: `${text} - Reviewed by: ${user.username}`,  // Append the username to the review text
    });

    // Save new review
    await newReview.save();
    console.log("New review inserted successfully:", newReview);

    // Link the review to the item
    await Item.findByIdAndUpdate(itemId, {
      $push: { reviews: newReview._id },
    });

    // Link the review to the user
    await User.findByIdAndUpdate(userId, {
      $push: { reviews: newReview._id },
    });

    // Respond with success message
    return NextResponse.json({ message: "Review submitted successfully" }, { status: 201 });

  } catch (error) {
    console.error("Error in /api/reviews:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
export async function GET() {
  await connectDB();

  try {
    const reviews = await Review.find().populate("userId", "username"); // Fetch username

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}