import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('ecommerce'); // 'ecommerce' is the database name you set up
  const collection = db.collection('items'); // 'items' is the collection for the products

  if (req.method === 'GET') {
    // Fetch all items from MongoDB
    const items = await collection.find({}).toArray();
    res.status(200).json(items);
  } else if (req.method === 'POST') {
    // Add a new item to MongoDB
    const { name, description, price, category } = req.body;
    const newItem = { name, description, price, category, createdAt: new Date() };
    const result = await collection.insertOne(newItem);
    res.status(201).json(result.ops[0]);
  }
}

