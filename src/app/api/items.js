import dbConnect from "@/utils/dbConnect";
import Item from "@/models/Item";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const items = await Item.find({});
    return res.status(200).json(items);
  }
}
