const jwt = require('jsonwebtoken'); // Install with `npm install jsonwebtoken`
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const NEXT_PUBLIC_MONGODB_DB = process.env.NEXT_PUBLIC_MONGODB_DB;

exports.handler = async function (event, context) {
  // Ensure the request method is POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();

    const { token } = JSON.parse(event.body); // Expecting a token in the request body
    const secret = process.env.NEXT_JWT_ENCODE_SECRET;

    // Decode the JWT token to extract the email
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      console.error('JWT verification failed:', err);
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid token', error: true }),
      };
    }

    const email = decoded.email;

    const users = client.db(NEXT_PUBLIC_MONGODB_DB).collection('users');
    const user = await users.findOne({ email });

    if (user) {
      const subscriptions = client
        .db(NEXT_PUBLIC_MONGODB_DB)
        .collection('subscriptions');
      const userSubscriptions = await subscriptions
        .find({ userid: new ObjectId(user._id.toString()) })
        .toArray();

      const transactions = client
        .db(NEXT_PUBLIC_MONGODB_DB)
        .collection('transactions');
      const userTransactions = await transactions
        .find({ custom_str2: user._id.toString() })
        .toArray();

      const affiliates = await users
        .find({ parent: user._id.toString() })
        .toArray();

      const affiliateSubscriptions = await subscriptions
        .find({ parentId: user._id.toString() })
        .toArray();
      const affiliateIds = affiliates.map((a) => a._id.toString());

      const affiliateTransactions = await transactions
        .find({ custom_str1: { $in: affiliateIds } })
        .toArray();

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'success',
          data: {
            user,
            affiliates,
            subscriptions: userSubscriptions,
            transactions: userTransactions,
            affiliateTransactions,
            affiliateSubscriptions,
          },
        }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: 'Invalid credentials',
          error: true,
        }),
      };
    }
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Couldn't restore user", error: true }),
    };
  } finally {
    await client.close();
  }
};
