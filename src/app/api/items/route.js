import { NextResponse } from "next/server";

export async function GET() {
  // Example static items (replace with MongoDB fetch)
  const items = [
    { _id: "1", name: "Antique Chair", price: 100, category: "Antique Furniture" },
    { _id: "2", name: "Running Shoes", price: 80, category: "Running Shoes" },
  ];
  return NextResponse.json(items);
}