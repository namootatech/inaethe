const { MongoClient } = require('mongodb');
require('dotenv').config();

const NEXT_PUBLIC_MONGODB_DB = process.env.NEXT_PUBLIC_MONGODB_DB;

exports.handler = async (event, context) => {
  const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const partnersCollection = client
      .db(NEXT_PUBLIC_MONGODB_DB)
      .collection('partners');

    if (event.httpMethod !== 'POST') {
      console.log('** [GET PARTNER ID FUNCTION] Method Not Allowed');
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
    }

    const { slug } = JSON.parse(event.body);

    if (!slug) {
      console.log('** [GET PARTNER ID FUNCTION] Missing slug');
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing slug' }),
      };
    }

    // Retrieve all partners (NPOs)
    const partner = await partnersCollection.findOne({ slug });
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Partner id retrieved successfully',
        data: partner._id,
      }),
    };
  } catch (error) {
    console.error('Error fetching partner id:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error fetching partners',
        error: true,
      }),
    };
  } finally {
    await client.close();
  }
};
