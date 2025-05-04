// src/functions/getUserTransactions.js
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

exports.handler = async (event, context) => {
  console.log('** [GET USER NETWORK SUBSCRIPTIONS FUNCTION] Received request');

  if (event.httpMethod !== 'POST') {
    console.log(
      '** [GET USER NETWORK SUBSCRIPTIONS FUNCTION] Method Not Allowed'
    );
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const { userId } = JSON.parse(event.body);

  if (!userId) {
    console.log('** [GET USER NETWORK SUBSCRIPTIONS FUNCTION] Missing userId');
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing userId' }),
    };
  }

  try {
    console.log(
      '** [GET USER NETWORK SUBSCRIPTIONS FUNCTION] Connecting to MongoDB'
    );
    await client.connect();
    console.log(
      '** [GET USER NETWORK SUBSCRIPTIONS FUNCTION] Connected to MongoDB'
    );

    const db = client.db(process.env.NEXT_PUBLIC_MONGODB_DB);
    const subscriptionsCollection = db.collection('subscriptions');

    console.log(
      `** [GET USER NETWORK SUBSCRIPTIONS FUNCTION] Fetching transactions for userId: ${userId} `
    );
    const networkSubscriptions = await subscriptionsCollection
      .find({ parentId: userId })
      .toArray();

    if (networkSubscriptions.length === 0) {
      console.log(
        '** [GET USER NETWORK SUBSCRIPTIONS FUNCTION] Transactions not found'
      );
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'No subs found',
          data: [],
        }),
      };
    }

    console.log(
      '** [GET USER NETWORK SUBSCRIPTIONS FUNCTION] Transactions fetched successfully'
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Transactions fetched successfully',
        data: networkSubscriptions,
      }),
    };
  } catch (error) {
    console.error(
      '** [GET USER NETWORK SUBSCRIPTIONS FUNCTION] Error fetching transactions:',
      error
    );
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  } finally {
    console.log(
      '** [GET USER NETWORK SUBSCRIPTIONS FUNCTION] Closing MongoDB connection'
    );
    await client.close();
    console.log(
      '** [GET USER NETWORK SUBSCRIPTIONS FUNCTION] MongoDB connection closed'
    );
  }
};
