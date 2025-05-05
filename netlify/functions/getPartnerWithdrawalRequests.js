// src/functions/getUserWithdrawalRequests.js
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

exports.handler = async (event, context) => {
  console.log('** [GET PARTNER WITHDRAWAL REQUESTS FUNCTION] Received request');

  if (event.httpMethod !== 'POST') {
    console.log(
      '** [GET PARTNER WITHDRAWAL REQUESTS FUNCTION] Method Not Allowed'
    );
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const { partnerId, page = 1, limit = 10 } = JSON.parse(event.body);

  if (!partnerId) {
    console.log(
      '** [GET PARTNER WITHDRAWAL REQUESTS FUNCTION] Missing partnerId',
      JSON.parse(event.body)
    );
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing partnerId' }),
    };
  }

  try {
    console.log(
      '** [GET PARTNER WITHDRAWAL REQUESTS FUNCTION] Connecting to MongoDB'
    );
    await client.connect();
    console.log(
      '** [GET PARTNER WITHDRAWAL REQUESTS FUNCTION] Connected to MongoDB'
    );

    const db = client.db(process.env.NEXT_PUBLIC_MONGODB_DB);
    const withdrawalRequestsCollection = db.collection('withdrawalRequests');

    console.log(
      '** [GET PARTNER WITHDRAWAL REQUESTS FUNCTION] Calculating skip value for pagination'
    );
    const skip = (page - 1) * limit;

    console.log(
      `** [GET PARTNER WITHDRAWAL REQUESTS FUNCTION] Fetching withdrawal requests for partnerId: ${partnerId} with skip: ${skip} and limit: ${limit}`
    );
    const userWithdrawalRequests = await withdrawalRequestsCollection
      .find({ partnerId })
      .skip(skip)
      .limit(limit)
      .toArray();

    if (userWithdrawalRequests.length === 0) {
      console.log(
        '** [GET PARTNER WITHDRAWAL REQUESTS FUNCTION] Withdrawal requests not found'
      );
      return {
        statusCode: 200,
        body: JSON.stringify([]),
      };
    }

    console.log(
      '** [GET PARTNER WITHDRAWAL REQUESTS FUNCTION] Withdrawal requests fetched successfully'
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Withdrawal requests fetched successfully',
        data: userWithdrawalRequests,
      }),
    };
  } catch (error) {
    console.error(
      '** [GET PARTNER WITHDRAWAL REQUESTS FUNCTION] Error fetching withdrawal requests:',
      error
    );
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  } finally {
    console.log(
      '** [GET PARTNER WITHDRAWAL REQUESTS FUNCTION] Closing MongoDB connection'
    );
    await client.close();
    console.log(
      '** [GET PARTNER WITHDRAWAL REQUESTS FUNCTION] MongoDB connection closed'
    );
  }
};
