// src/functions/getpartnerEarnings.js
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

exports.handler = async (event, context) => {
  console.log('** [GET partner EARNINGS FUNCTION] Received request');

  if (event.httpMethod !== 'POST') {
    console.log('** [GET partner EARNINGS FUNCTION] Method Not Allowed');
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const { partner } = JSON.parse(event.body);

  if (!partner) {
    console.log('** [GET partner EARNINGS FUNCTION] Missing partner');
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing partner' }),
    };
  }

  try {
    console.log('** [GET partner EARNINGS FUNCTION] Connecting to MongoDB');
    await client.connect();
    console.log('** [GET partner EARNINGS FUNCTION] Connected to MongoDB');

    const db = client.db(process.env.NEXT_PUBLIC_MONGODB_DB);
    const earningsCollection = db.collection('earnings');

    console.log(
      `** [GET partner EARNINGS FUNCTION] Fetching earnings for partner: ${partner}`
    );
    const partnerEarnings = await earningsCollection
      .find({ partner })
      .toArray();

    if (!partnerEarnings) {
      console.log('** [GET partner EARNINGS FUNCTION] Earnings not found');
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'No earnings found',
          data: [],
        }),
      };
    }

    console.log(
      '** [GET partner EARNINGS FUNCTION] Earnings fetched successfully'
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Earnings fetched successfully',
        data: partnerEarnings,
      }),
    };
  } catch (error) {
    console.error(
      '** [GET partner EARNINGS FUNCTION] Error fetching earnings:',
      error
    );
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  } finally {
    console.log(
      '** [GET partner EARNINGS FUNCTION] Closing MongoDB connection'
    );
    await client.close();
    console.log('** [GET partner EARNINGS FUNCTION] MongoDB connection closed');
  }
};
