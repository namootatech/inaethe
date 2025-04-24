// src/functions/getUserReferralLink.js
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

exports.handler = async (event, context) => {
  console.log('** [GET USER REFERRAL LINK FUNCTION] Received request');
  if (event.httpMethod !== 'POST') {
    console.log('** [GET USER REFERRAL LINK FUNCTION] Method Not Allowed');
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const { userId } = JSON.parse(event.body);
  console.log('** [GET USER REFERRAL LINK FUNCTION] userId:', userId);
  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing userId' }),
    };
  }

  try {
    await client.connect();
    const db = client.db(process.env.NEXT_PUBLIC_MONGODB_DB);
    const referralLinksCollection = db.collection('referralLinks');

    const referralLink = await referralLinksCollection.findOne({ userId });

    if (!referralLink) {
      console.log(
        '** [GET USER REFERRAL LINK FUNCTION] Referral link not found'
      );
    }

    console.log(
      '** [GET USER REFERRAL LINK FUNCTION] Referral link found:',
      referralLink
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Referral link fetched successfully',
        data: referralLink,
      }),
    };
  } catch (error) {
    console.error(
      '** [GET USER REFERRAL LINK FUNCTION] Error fetching referral link:',
      error
    );
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  } finally {
    console.log('** [GET USER REFERRAL LINK FUNCTION] Closing connection');
    await client.close();
  }
};
