import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // Environment variable from Vercel
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      await client.connect();
      const db = client.db('cozycoredb'); // Your database name
      const users = db.collection('users');

      const existingUser = await users.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      await users.insertOne({ username, password });
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
