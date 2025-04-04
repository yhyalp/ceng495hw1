// /src/app/api/items/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Item from "@/models/Item";
import Rating from "@/models/Rating";
import Review from "@/models/Review";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET - Retrieve all items
export async function GET() {
  try {
    await connectDB();

    const items = await Item.find().populate('reviews').populate('ratings');
    
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Add a new item (admin)
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const { name, description, price, seller, category, attributes } = body;

    if (!name || !price || !seller || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newItem = new Item({
      name,
      description,
      price,
      seller,
      category,
      ...attributes, // Spread attributes dynamically
    });

    await newItem.save();
    return NextResponse.json(newItem, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}

// DELETE - Remove an item (admin)
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const { id } = params; // Extract item ID from URL
    console.log("Deleting item with ID:", id);

    // Ensure item exists before deleting
    const item = await Item.findById(id);
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    await Item.findByIdAndDelete(id);
    console.log("Item deleted successfully");

    return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}

// POST - Add a rating to an item (regular user)
export async function POST_rating(req) {
  const { itemId, ratingValue, userId } = await req.json();

  try {
    await connectDB();

    // Find the item
    const item = await Item.findById(itemId);
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Find existing rating for the user and update it if exists
    const existingRating = await Rating.findOne({ userId, itemId });
    if (existingRating) {
      existingRating.rating = ratingValue;
      await existingRating.save();
    } else {
      const newRating = new Rating({ userId, itemId, rating: ratingValue });
      await newRating.save();
    }

    // Recalculate the average rating for the item
    const ratings = await Rating.find({ itemId });
    const averageRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;
    item.rating = averageRating;
    await item.save();

    return NextResponse.json({ message: "Rating updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Add a review to an item (regular user)
export async function POST_review(req) {
  const { itemId, reviewText, userId } = await req.json();

  try {
    await connectDB();

    // Find the item
    const item = await Item.findById(itemId);
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Find existing review for the user and update it if exists
    const existingReview = await Review.findOne({ userId, itemId });
    if (existingReview) {
      existingReview.text = reviewText;
      await existingReview.save();
    } else {
      const newReview = new Review({ userId, itemId, text: reviewText });
      await newReview.save();
    }

    // Update the reviews array for the item
    item.reviews.push(reviewText);
    await item.save();

    return NextResponse.json({ message: "Review updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
