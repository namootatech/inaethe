// src/functions/getUserTransactions.js
const { MongoClient, ObjectId } = require('mongodb');

const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

exports.handler = async (event, context) => {
  console.log('** [GET USER SUBSCRIPTIONS FUNCTION] Received request');

  if (event.httpMethod !== 'POST') {
    console.log('** [GET USER SUBSCRIPTIONS FUNCTION] Method Not Allowed');
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const { userId, page = 1, limit = 10 } = JSON.parse(event.body);

  if (!userId) {
    console.log('** [GET USER SUBSCRIPTIONS FUNCTION] Missing userId');
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing userId' }),
    };
  }

  try {
    console.log('** [GET USER SUBSCRIPTIONS FUNCTION] Connecting to MongoDB');
    await client.connect();
    console.log('** [GET USER SUBSCRIPTIONS FUNCTION] Connected to MongoDB');

    const db = client.db(process.env.NEXT_PUBLIC_MONGODB_DB);
    const subscriptionsCollection = db.collection('subscriptions');

    console.log(
      `** [GET USER SUBSCRIPTIONS FUNCTION] Calculating skip value for pagination`
    );
    const skip = (page - 1) * limit;

    console.log(
      `** [GET USER SUBSCRIPTIONS FUNCTION] Fetching subscriptions for userId: ${userId} with skip: ${skip} and limit: ${limit}`
    );
    const userSubscriptions = await subscriptionsCollection
      .find({ userId: new ObjectId(userId) })
      .skip(skip)
      .limit(limit)
      .toArray();

    if (userSubscriptions.length === 0) {
      console.log(
        '** [GET USER SUBSCRIPTIONS FUNCTION] Subscriptions not found'
      );
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Subscriptions not found',
          data: [],
        }),
      };
    }

    console.log(
      '** [GET USER SUBSCRIPTIONS FUNCTION] Subscriptions fetched successfully'
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Subscriptions fetched successfully',
        data: userSubscriptions,
      }),
    };
  } catch (error) {
    console.error(
      '** [GET USER SUBSCRIPTIONS FUNCTION] Error fetching subscriptions:',
      error
    );
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  } finally {
    console.log(
      '** [GET USER SUBSCRIPTIONS FUNCTION] Closing MongoDB connection'
    );
    await client.close();
    console.log(
      '** [GET USER SUBSCRIPTIONS FUNCTION] MongoDB connection closed'
    );
  }
};
