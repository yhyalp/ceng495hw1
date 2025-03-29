import { connectDB } from "@/lib/db";
import Item from "@/models/Item";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const items = await Item.find({});
  return NextResponse.json(items);
}
export const dynamic = "force-dynamic";
