import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;  // MongoDB URI from .env.local

const client = new MongoClient(uri);

export default async function handler(req, res) {
  try {
    await client.connect();
    const database = client.db('ecommerce');
    const itemsCollection = database.collection('items');

    // Fetch all items from MongoDB
    const items = await itemsCollection.find({}).toArray();

    // Send the items as a JSON response
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  } finally {
    await client.close();
  }
}

