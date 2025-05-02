const jwt = require('jsonwebtoken'); // Install with `npm install jsonwebtoken`
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const NEXT_PUBLIC_MONGODB_DB = process.env.NEXT_PUBLIC_MONGODB_DB;

exports.handler = async function (event, context) {
  console.log('** [RESTORE PARTNER FUNCTION] API invoked');

  // Ensure the request method is POST
  if (event.httpMethod !== 'POST') {
    console.log(
      '** [RESTORE PARTNER FUNCTION] Invalid HTTP method: ' + event.httpMethod
    );
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    console.log('** [RESTORE PARTNER FUNCTION] Connecting to MongoDB...');
    await client.connect();
    console.log('** [RESTORE PARTNER FUNCTION] Connected to MongoDB');

    const { token } = JSON.parse(event.body); // Expecting a token in the request body
    console.log('** [RESTORE PARTNER FUNCTION] Received token', token);

    const secret = process.env.NEXT_PUBLIC_JWT_ENCODE_SECRET;
    console.log('** [RESTORE PARTNER FUNCTION] Using JWT secret', secret);

    // Decode the JWT token to extract the email
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
      console.log('** [RESTORE PARTNER FUNCTION] JWT verified successfully');
    } catch (err) {
      console.error(
        '** [RESTORE PARTNER FUNCTION] JWT verification failed:',
        err
      );
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid token', error: true }),
      };
    }

    const email = decoded.email;
    console.log('** [RESTORE PARTNER FUNCTION] Extracted email: ' + email);

    const partners = client.db(NEXT_PUBLIC_MONGODB_DB).collection('partners');
    console.log('** [RESTORE PARTNER FUNCTION] Querying user from database...');
    const partner = await partners.findOne({ email });

    if (partner) {
      console.log(
        '** [RESTORE PARTNER FUNCTION] Partner found, fetching additional data...'
      );

      const subscriptions = client
        .db(NEXT_PUBLIC_MONGODB_DB)
        .collection('subscriptions');

      const partnersubscriptions = await subscriptions
        .find({ 'partner.slug': partners.slug })
        .toArray();
      console.log(
        '** [RESTORE PARTNER FUNCTION] Partner subscriptions fetched'
      );

      const transactions = client
        .db(NEXT_PUBLIC_MONGODB_DB)
        .collection('transactions');

      const partnerTransactions = await transactions
        .find({ partner: partner.slug })
        .toArray();
      console.log('** [RESTORE PARTNER FUNCTION] Partner transactions fetched');

      console.log(
        '** [RESTORE PARTNER FUNCTION] Successfully fetched all data, returning response...'
      );
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'success',
          data: {
            partner,
            subscriptions: partnersubscriptions,
            transactions: partnerTransactions,
          },
        }),
      };
    } else {
      console.log('** [RESTORE PARTNER FUNCTION] Partner not found');
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: 'Invalid credentials',
          error: true,
        }),
      };
    }
  } catch (e) {
    console.error('** [RESTORE PARTNER FUNCTION] Error occurred:', e);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Couldn't restore user", error: true }),
    };
  } finally {
    console.log('** [RESTORE PARTNER FUNCTION] Closing MongoDB connection');
    await client.close();
    console.log('** [RESTORE PARTNER FUNCTION] MongoDB connection closed');
  }
};
