const { MongoClient } = require('mongodb');

const uri = process.env.NEXT_PUBLIC_MONGODB_URI; // MongoDB connection string

const NEXT_PUBLIC_MONGODB_DB = process.env.NEXT_PUBLIC_MONGODB_DB;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

exports.handler = async (event) => {
  console.log('** [SAVE TRANSACTION FUNCTION] entry...');
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('** [SAVE TRANSACTION FUNCTION] Parsing request body...');
    const {
      amount,
      subscriptionId,
      userId,
      subscriptionTier,
      firstName,
      lastName,
      email,
      paymentMethod,
      level,
      parentId,
      partner,
      paymentId,
    } = JSON.parse(event.body);

    const params = [
      subscriptionId,
      userId,
      subscriptionTier,
      firstName,
      lastName,
      email,
      paymentMethod,
      level,
      parentId,
      partner,
      paymentId,
      amount,
    ];
    console.log('** [SAVE TRANSACTION FUNCTION] params:', {
      amount,
      subscriptionId,
      userId,
      subscriptionTier,
      firstName,
      lastName,
      email,
      paymentMethod,
      level,
      parentId,
      partner,
      paymentId,
    });
    if (params.some((param) => !param || param === '')) {
      console.error(
        '** [ADD transaction] Missing required fields in request body.'
      );
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    await client.connect();
    const transactionsCollection = client
      .db(NEXT_PUBLIC_MONGODB_DB)
      .collection('transactions');

    const earningsCollection = client
      .db(NEXT_PUBLIC_MONGODB_DB)
      .collection('earnings');

    const createdAt = new Date();

    const transaction = {
      amount,
      subscriptionId,
      userId,
      subscriptionTier,
      firstName,
      lastName,
      email,
      paymentMethod,
      level,
      parentId,
      partner,
      paymentId,
      createdAt,
    };

    console.log('** [SAVE TRANSACTION FUNCTION] Inserting transaction...');

    const result = await transactionsCollection.insertOne(transaction);

    console.log('** [SAVE TRANSACTION FUNCTION] transaction inserted:', result);
    const fortyPercentOfAmount = (amount * 0.4).toFixed(2);
    const twentyPercentOfAmount = (amount * 0.2).toFixed(2);

    const parentEarning = {
      userId: parentId,
      amount: fortyPercentOfAmount,
      subscriptionId,
      transactionId: result.insertedId,
      paymentId,
      type: 'user-earning',
      createdAt,
    };

    const partnerEarning = {
      partner,
      amount: fortyPercentOfAmount,
      subscriptionId,
      transactionId: result.insertedId,
      paymentId,
      type: 'partner-earning',
      createdAt,
    };

    const systemEarning = {
      amount: twentyPercentOfAmount,
      subscriptionId,
      transactionId: result.insertedId,
      paymentId,
      type: 'system-earning',
      createdAt,
    };

    await earningsCollection.insertMany([
      parentEarning,
      partnerEarning,
      systemEarning,
    ]);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'transaction post added successfully',
        transactionId: result.insertedId,
      }),
    };
  } catch (error) {
    console.error(
      '** [SAVE TRANSACTION FUNCTION] Error adding transaction:',
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
