// src/functions/getUserTransactions.js
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

exports.handler = async (event, context) => {
  console.log('** [GET USER TRANSACTIONS FUNCTION] Received request');

  if (event.httpMethod !== 'POST') {
    console.log('** [GET USER TRANSACTIONS FUNCTION] Method Not Allowed');
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const { userId, page = 1, limit = 10 } = JSON.parse(event.body);

  if (!userId) {
    console.log('** [GET USER TRANSACTIONS FUNCTION] Missing userId');
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing userId' }),
    };
  }

  try {
    console.log('** [GET USER TRANSACTIONS FUNCTION] Connecting to MongoDB');
    await client.connect();
    console.log('** [GET USER TRANSACTIONS FUNCTION] Connected to MongoDB');

    const db = client.db(process.env.NEXT_PUBLIC_MONGODB_DB);
    const transactionsCollection = db.collection('transactions');

    console.log(
      `** [GET USER TRANSACTIONS FUNCTION] Calculating skip value for pagination`
    );
    const skip = (page - 1) * limit;

    console.log(
      `** [GET USER TRANSACTIONS FUNCTION] Fetching transactions for userId: ${userId} with skip: ${skip} and limit: ${limit}`
    );
    const userTransactions = await transactionsCollection
      .find({ custom_str2: userId })
      .skip(skip)
      .limit(limit)
      .toArray();

    if (userTransactions.length === 0) {
      console.log('** [GET USER TRANSACTIONS FUNCTION] Transactions not found');
      return {
        statusCode: 200,
        body: JSON.stringify([]),
      };
    }

    console.log(
      '** [GET USER TRANSACTIONS FUNCTION] Transactions fetched successfully'
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Transactions fetched successfully',
        data: userTransactions,
      }),
    };
  } catch (error) {
    console.error(
      '** [GET USER TRANSACTIONS FUNCTION] Error fetching transactions:',
      error
    );
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  } finally {
    console.log(
      '** [GET USER TRANSACTIONS FUNCTION] Closing MongoDB connection'
    );
    await client.close();
    console.log(
      '** [GET USER TRANSACTIONS FUNCTION] MongoDB connection closed'
    );
  }
};
