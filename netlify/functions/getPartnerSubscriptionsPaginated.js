// src/functions/getpartnerTransactions.js
const { MongoClient, ObjectId } = require('mongodb');

const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

exports.handler = async (event, context) => {
  console.log('** [GET partner SUBSCRIPTIONS FUNCTION] Received request');

  if (event.httpMethod !== 'POST') {
    console.log('** [GET partner SUBSCRIPTIONS FUNCTION] Method Not Allowed');
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const { partnerId, page = 1, limit = 10 } = JSON.parse(event.body);

  if (!partnerId) {
    console.log('** [GET partner SUBSCRIPTIONS FUNCTION] Missing partnerId');
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing partnerId' }),
    };
  }

  try {
    console.log(
      '** [GET partner SUBSCRIPTIONS FUNCTION] Connecting to MongoDB'
    );
    await client.connect();
    console.log('** [GET partner SUBSCRIPTIONS FUNCTION] Connected to MongoDB');

    const db = client.db(process.env.NEXT_PUBLIC_MONGODB_DB);
    const subscriptionsCollection = db.collection('subscriptions');

    console.log(
      `** [GET partner SUBSCRIPTIONS FUNCTION] Calculating skip value for pagination`
    );
    const skip = (page - 1) * limit;

    console.log(
      `** [GET partner SUBSCRIPTIONS FUNCTION] Fetching subscriptions for partnerId: ${partnerId} with skip: ${skip} and limit: ${limit}`
    );
    const partnerSubscriptions = await subscriptionsCollection
      .find({ partnerId: new ObjectId(partnerId) })
      .skip(skip)
      .limit(limit)
      .toArray();

    if (partnerSubscriptions.length === 0) {
      console.log(
        '** [GET partner SUBSCRIPTIONS FUNCTION] Subscriptions not found'
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
      '** [GET partner SUBSCRIPTIONS FUNCTION] Subscriptions fetched successfully'
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Subscriptions fetched successfully',
        data: partnerSubscriptions,
      }),
    };
  } catch (error) {
    console.error(
      '** [GET partner SUBSCRIPTIONS FUNCTION] Error fetching subscriptions:',
      error
    );
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  } finally {
    console.log(
      '** [GET partner SUBSCRIPTIONS FUNCTION] Closing MongoDB connection'
    );
    await client.close();
    console.log(
      '** [GET partner SUBSCRIPTIONS FUNCTION] MongoDB connection closed'
    );
  }
};
