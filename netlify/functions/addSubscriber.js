const { MongoClient } = require('mongodb');

const uri = process.env.NEXT_PUBLIC_MONGODB_URI; // MongoDB connection string

const NEXT_PUBLIC_MONGODB_DB = process.env.NEXT_PUBLIC_MONGODB_DB;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

exports.handler = async (event) => {
  console.log('** [ADD SUBSCRIBER FUNCTION] entry...');
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('** [ADD SUBSCRIBER FUNCTION] Parsing request body...');
    const { email, organisationId } = JSON.parse(event.body);

    if (!email || !organisationId) {
      console.error(
        '** [ADD SUBSCRIBER] Missing required fields in request body.'
      );
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    await client.connect();
    const subscribersCollection = client
      .db(NEXT_PUBLIC_MONGODB_DB)
      .collection('subscribers');

    const subscriber = {
      email,
      organisationId,
      createdAt: new Date().toISOString(),
    };

    console.log('** [ADD SUBSCRIBER FUNCTION] Inserting subscriber...');

    const result = await subscribersCollection.insertOne(subscriber);

    console.log('** [ADD SUBSCRIBER FUNCTION] Subscriber inserted:', result);
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Subscriber post added successfully',
        subscriberId: result.insertedId,
      }),
    };
  } catch (error) {
    console.error(
      '** [ADD SUBSCRIBER FUNCTION] Error adding subscriber:',
      error
    );
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  } finally {
    await client.close();
  }
};
