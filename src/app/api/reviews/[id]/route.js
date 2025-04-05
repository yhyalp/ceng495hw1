import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import Item from "@/models/Item";  // Item model

// Fetch an item with populated reviews
export async function GET(req, context) {
    await connectDB();
    const id = await context.params.id;
  
    try {
      const item = await Item.findById(id).populate('reviews');
  
      if (!item) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
      }
      console.log("Fetched item with reviews:", item); // Check item structure in the console
  
      return NextResponse.json(item); // Returning the item with populated reviews
    } catch (error) {
      console.error("Error fetching item:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) return NextResponse.json({ error: "Review not found" }, { status: 404 });

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
