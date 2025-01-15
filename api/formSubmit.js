import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {
      fullName,
      dob,
      phone,
      email,
      yogaExperience,
      yogaStyles,
      yogaGoals,
      medicalConditions,
      conditionsDescription,
      medications,
      conditions,
      pregnancy,
    } = req.body;

    try {
      await client.connect();
      const db = client.db('cozycoredb');
      const forms = db.collection('yogaForms');

      // Insert form data into the database
      await forms.insertOne({
        fullName,
        dob,
        phone,
        email,
        yogaExperience,
        yogaStyles,
        yogaGoals,
        medicalConditions,
        conditionsDescription,
        medications,
        conditions,
        pregnancy,
        submittedAt: new Date(),
      });

      res.status(201).json({ message: 'Form submitted successfully!' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to submit form' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
