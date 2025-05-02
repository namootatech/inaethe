const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const NEXT_PUBLIC_MONGODB_DB = process.env.NEXT_PUBLIC_MONGODB_DB;

exports.handler = async (event, context) => {
  const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const usersCollection = client
      .db(NEXT_PUBLIC_MONGODB_DB)
      .collection('users');
    const transactionsCollection = client
      .db(NEXT_PUBLIC_MONGODB_DB)
      .collection('transactions');

    // Extract userId from query parameters
    const { userId } = event.queryStringParameters;

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'User ID is required',
          error: true,
        }),
      };
    }

    // Aggregate to get affiliates along with their latest transaction
    const affiliates = await usersCollection
      .aggregate([
        {
          $match: {
            parent: userId,
          },
        },
        {
          $lookup: {
            from: 'transactions',
            localField: 'email',
            foreignField: 'email',
            as: 'transactions',
          },
        },
        {
          $unwind: {
            path: '$transactions',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: {
            'transactions.createdAt': -1,
          },
        },
        {
          $group: {
            _id: '$_id',
            firstName: { $first: '$firstName' },
            lastName: { $first: '$lastName' },
            email: { $first: '$email' },
            transaction: { $first: '$transactions' },
          },
        },
      ])
      .toArray();

    // Return the affiliates data
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'success',
        affiliates,
      }),
    };
  } catch (error) {
    console.error('Error fetching affiliates:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error fetching affiliates',
        error: true,
      }),
    };
  } finally {
    await client.close();
  }
};
