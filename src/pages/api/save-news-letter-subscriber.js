import clientPromise from '@/util/mongo';

const isDevEnvironment = process.env.NODE_ENV === 'development';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log(
      '** [API HANDLER] Handling POST request to save-newsletter-subscriber **'
    );

    try {
      const client = await clientPromise;
      const db = client.db(process.env.NEXT_PUBLIC_MONGODB_DB);
      const collection = db.collection('news-letter-subscribers');

      const user = req.body;
      const newUser = { ...user, createdAt: new Date() };

      if (user.email) {
        const existingUser = await collection.findOne({ email: user.email });
        if (!existingUser) {
          await collection.insertOne(newUser);
          res.status(200).json({ status: 'success', message: 'Subscribed!' });
        } else {
          res
            .status(400)
            .json({ status: 'error', message: 'Email already exists' });
        }
      }
    } catch (e) {
      console.log(
        '** [API HANDLER] Error handling POST request to save-newsletter-subscriber **',
        e
      );
    }
  } else {
    res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }
}
