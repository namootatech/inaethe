// src/functions/getUserEarnings.js
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

exports.handler = async (event, context) => {
  console.log('** [GET USER EARNINGS FUNCTION] Received request');

  if (event.httpMethod !== 'POST') {
    console.log('** [GET USER EARNINGS FUNCTION] Method Not Allowed');
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const { userId } = JSON.parse(event.body);

  if (!userId) {
    console.log('** [GET USER EARNINGS FUNCTION] Missing userId');
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing userId' }),
    };
  }

  try {
    console.log('** [GET USER EARNINGS FUNCTION] Connecting to MongoDB');
    await client.connect();
    console.log('** [GET USER EARNINGS FUNCTION] Connected to MongoDB');

    const db = client.db(process.env.NEXT_PUBLIC_MONGODB_DB);
    const earningsCollection = db.collection('earnings');

    console.log(
      `** [GET USER EARNINGS FUNCTION] Fetching earnings for userId: ${userId}`
    );
    const userEarnings = await earningsCollection.findOne({ userId });

    if (!userEarnings) {
      console.log('** [GET USER EARNINGS FUNCTION] Earnings not found');
      return {
        statusCode: 200,
        body: JSON.stringify({}),
      };
    }

    console.log(
      '** [GET USER EARNINGS FUNCTION] Earnings fetched successfully'
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Earnings fetched successfully',
        data: userEarnings,
      }),
    };
  } catch (error) {
    console.error(
      '** [GET USER EARNINGS FUNCTION] Error fetching earnings:',
      error
    );
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  } finally {
    console.log('** [GET USER EARNINGS FUNCTION] Closing MongoDB connection');
    await client.close();
    console.log('** [GET USER EARNINGS FUNCTION] MongoDB connection closed');
  }
};
