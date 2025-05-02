const bcrypt = require('bcrypt-nodejs');
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
  await client.connect();
  try {
    const { email, password } = JSON.parse(event.body);
    // Assuming mongoClient is a shared instance of MongoDB connection
    const users = client.db(NEXT_PUBLIC_MONGODB_DB).collection('users');
    const user = await users.findOne({ email });

    if (user && bcrypt.compareSync(password, user.hash)) {
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
        .find({ userId: user._id.toString() })
        .toArray();

      const affiliates = await users
        .find({ parent: user._id.toString() })
        .toArray();

      const affiliateSubscriptions = await subscriptions
        .find({ parentId: user._id.toString() })
        .toArray();

      const affiliateTransactions = await transactions
        .find({ parentId: user._id.toString() })
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
      body: JSON.stringify({ message: "Couldn't login", error: true }),
    };
  }
};
