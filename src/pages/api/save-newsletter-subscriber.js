import clientPromise from '@/util/mongo';
import { ObjectId } from 'mongodb';
const { App } = require('@slack/bolt');

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
      console.log('Request', req.body);
      console.log('newUser', newUser);
      if (user.email) {
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
