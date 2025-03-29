import { NextResponse } from "next/server";

export async function GET() {
  const items = [
    { _id: "1", name: "Vinyl Record", price: 30 },
    { _id: "2", name: "Antique Chair", price: 120 },
    { _id: "3", name: "GPS Sport Watch", price: 200 },
    { _id: "4", name: "Running Shoes", price: 80 },
  ];

  return NextResponse.json(items);
}
