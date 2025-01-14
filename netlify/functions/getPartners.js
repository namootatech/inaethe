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

    // Retrieve all partners (NPOs)
    const partnerList = await partnersCollection.find({}).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Partners retrieved successfully',
        partners: partnerList,
      }),
    };
  } catch (error) {
    console.error('Error fetching partners:', error);
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
