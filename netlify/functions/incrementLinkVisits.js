// src/functions/createReferralLink.js
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

exports.handler = async (event, context) => {
  console.log('** [INC LINK VISITS FUNCTION] Received request');
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const { id } = JSON.parse(event.body);

  if (!id) {
    console.log('** [INC LINK VISITS FUNCTION] Missing userId or referralLink');
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing userId or referralLink' }),
    };
  }

  try {
    await client.connect();
    const db = client.db(process.env.NEXT_PUBLIC_MONGODB_DB);
    const referralLinksCollection = db.collection('referralLinks');

    // Check if the user already has a referral link
    const existingReferralLink = await referralLinksCollection.findOne({
      id,
    });

    const newVists = existingReferralLink.visits + 1;

    await referralLinksCollection.updateOne(
      { id },
      { $set: { visits: newVists } }
    );

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Referral link updated successfully',
        data: {},
      }),
    };
  } catch (error) {
    console.error('Error creating referral link:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  } finally {
    await client.close();
  }
};
