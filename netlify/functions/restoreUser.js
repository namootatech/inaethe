const jwt = require('jsonwebtoken'); // Install with `npm install jsonwebtoken`
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const NEXT_PUBLIC_MONGODB_DB = process.env.NEXT_PUBLIC_MONGODB_DB;

exports.handler = async function (event, context) {
  console.log('** [RESTORE USER FUNCTION] API invoked');

  // Ensure the request method is POST
  if (event.httpMethod !== 'POST') {
    console.log(
      '** [RESTORE USER FUNCTION] Invalid HTTP method: ' + event.httpMethod
    );
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
    console.log('** [RESTORE USER FUNCTION] Connecting to MongoDB...');
    await client.connect();
    console.log('** [RESTORE USER FUNCTION] Connected to MongoDB');

    const { token } = JSON.parse(event.body); // Expecting a token in the request body
    console.log('** [RESTORE USER FUNCTION] Received token', token);

    const secret = process.env.NEXT_PUBLIC_JWT_ENCODE_SECRET;
    console.log('** [RESTORE USER FUNCTION] Using JWT secret', secret);

    // Decode the JWT token to extract the email
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
      console.log('** [RESTORE USER FUNCTION] JWT verified successfully');
    } catch (err) {
      console.error('** [RESTORE USER FUNCTION] JWT verification failed:', err);
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid token', error: true }),
      };
    }

    const email = decoded.email;
    console.log('** [RESTORE USER FUNCTION] Extracted email: ' + email);

    const users = client.db(NEXT_PUBLIC_MONGODB_DB).collection('users');
    console.log('** [RESTORE USER FUNCTION] Querying user from database...');
    const user = await users.findOne({ email });

    if (user) {
      console.log(
        '** [RESTORE USER FUNCTION] User found, fetching additional data...'
      );

      const subscriptions = client
        .db(NEXT_PUBLIC_MONGODB_DB)
        .collection('subscriptions');
      const userSubscriptions = await subscriptions
        .find({ userid: new ObjectId(user._id.toString()) })
        .toArray();
      console.log('** [RESTORE USER FUNCTION] User subscriptions fetched');

      const transactions = client
        .db(NEXT_PUBLIC_MONGODB_DB)
        .collection('transactions');
      const userTransactions = await transactions
        .find({ custom_str2: user._id.toString() })
        .toArray();
      console.log('** [RESTORE USER FUNCTION] User transactions fetched');

      const affiliates = await users
        .find({ parent: user._id.toString() })
        .toArray();
      console.log('** [RESTORE USER FUNCTION] Affiliates fetched');

      const affiliateSubscriptions = await subscriptions
        .find({ parentId: user._id.toString() })
        .toArray();
      console.log('** [RESTORE USER FUNCTION] Affiliate subscriptions fetched');

      const affiliateIds = affiliates.map((a) => a._id.toString());
      const affiliateTransactions = await transactions
        .find({ custom_str1: { $in: affiliateIds } })
        .toArray();
      console.log('** [RESTORE USER FUNCTION] Affiliate transactions fetched');

      console.log(
        '** [RESTORE USER FUNCTION] Successfully fetched all data, returning response...'
      );
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
      console.log('** [RESTORE USER FUNCTION] User not found');
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: 'Invalid credentials',
          error: true,
        }),
      };
    }
  } catch (e) {
    console.error('** [RESTORE USER FUNCTION] Error occurred:', e);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Couldn't restore user", error: true }),
    };
  } finally {
    console.log('** [RESTORE USER FUNCTION] Closing MongoDB connection');
    await client.close();
    console.log('** [RESTORE USER FUNCTION] MongoDB connection closed');
  }
};
