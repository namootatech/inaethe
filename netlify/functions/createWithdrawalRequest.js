// src/functions/createWithdrawalRequest.js
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

exports.handler = async (event, context) => {
  console.log('** [CREATE WITHDRAWAL REQUEST FUNCTION] Received request');

  if (event.httpMethod !== 'POST') {
    console.log('** [CREATE WITHDRAWAL REQUEST FUNCTION] Method Not Allowed');
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const withdrawalRequest = JSON.parse(event.body);

  if (!withdrawalRequest) {
    console.log(
      '** [CREATE WITHDRAWAL REQUEST FUNCTION] Missing withdrawal request data'
    );
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing withdrawal request data' }),
    };
  }

  try {
    console.log(
      '** [CREATE WITHDRAWAL REQUEST FUNCTION] Connecting to MongoDB'
    );
    await client.connect();
    console.log('** [CREATE WITHDRAWAL REQUEST FUNCTION] Connected to MongoDB');

    const db = client.db(process.env.NEXT_PUBLIC_MONGODB_DB);
    const withdrawalRequestsCollection = db.collection('withdrawalRequests');

    console.log(
      '** [CREATE WITHDRAWAL REQUEST FUNCTION] Inserting withdrawal request'
    );
    const result = await withdrawalRequestsCollection.insertOne(
      withdrawalRequest
    );

    console.log(
      '** [CREATE WITHDRAWAL REQUEST FUNCTION] Withdrawal request inserted successfully'
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Withdrawal request created successfully',
        data: result.ops[0],
      }),
    };
  } catch (error) {
    console.error(
      '** [CREATE WITHDRAWAL REQUEST FUNCTION] Error inserting withdrawal request:',
      error
    );
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  } finally {
    console.log(
      '** [CREATE WITHDRAWAL REQUEST FUNCTION] Closing MongoDB connection'
    );
    await client.close();
    console.log(
      '** [CREATE WITHDRAWAL REQUEST FUNCTION] MongoDB connection closed'
    );
  }
};
