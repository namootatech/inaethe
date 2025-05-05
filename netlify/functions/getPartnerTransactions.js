// src/functions/getpartnerTransactions.js
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

exports.handler = async (event, context) => {
  console.log('** [GET PARTNER TRANSACTIONS FUNCTION] Received request');

  if (event.httpMethod !== 'POST') {
    console.log('** [GET PARTNER TRANSACTIONS FUNCTION] Method Not Allowed');
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const { slug, page = 1, limit = 10 } = JSON.parse(event.body);

  if (!slug) {
    console.log('** [GET PARTNER TRANSACTIONS FUNCTION] Missing slug');
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing partnerId' }),
    };
  }

  try {
    console.log('** [GET PARTNER TRANSACTIONS FUNCTION] Connecting to MongoDB');
    await client.connect();
    console.log('** [GET PARTNER TRANSACTIONS FUNCTION] Connected to MongoDB');

    const db = client.db(process.env.NEXT_PUBLIC_MONGODB_DB);
    const transactionsCollection = db.collection('transactions');

    console.log(
      `** [GET PARTNER TRANSACTIONS FUNCTION] Calculating skip value for pagination`
    );
    const skip = (page - 1) * limit;

    console.log(
      `** [GET PARTNER TRANSACTIONS FUNCTION] Fetching transactions for partnerId: ${slug} with skip: ${skip} and limit: ${limit}`
    );
    const partnerTransactions = await transactionsCollection
      .find({ partner: slug })
      .skip(skip)
      .limit(limit)
      .toArray();

    if (partnerTransactions.length === 0) {
      console.log(
        '** [GET PARTNER TRANSACTIONS FUNCTION] Transactions not found'
      );
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'No transactions found',
          data: [],
        }),
      };
    }

    console.log(
      '** [GET PARTNER TRANSACTIONS FUNCTION] Transactions fetched successfully'
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Transactions fetched successfully',
        data: partnerTransactions,
      }),
    };
  } catch (error) {
    console.error(
      '** [GET PARTNER TRANSACTIONS FUNCTION] Error fetching transactions:',
      error
    );
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  } finally {
    console.log(
      '** [GET PARTNER TRANSACTIONS FUNCTION] Closing MongoDB connection'
    );
    await client.close();
    console.log(
      '** [GET PARTNER TRANSACTIONS FUNCTION] MongoDB connection closed'
    );
  }
};
