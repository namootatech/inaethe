const bcrypt = require('bcrypt-nodejs');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const NEXT_PUBLIC_MONGODB_DB = process.env.NEXT_PUBLIC_MONGODB_DB;

exports.handler = async function (event, context) {
  console.log('** [LOGIN NPO ] Received request');
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }
  const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  try {
    const { email, password } = JSON.parse(event.body);
    console.log('** [LOGIN NPO ] Finding partner', email, password);
    const users = client.db(NEXT_PUBLIC_MONGODB_DB).collection('partners');
    const partner = await users.findOne({ email });

    if (partner && bcrypt.compareSync(password, partner.hash)) {
      console.log('** [LOGIN NPO ] Partner found');
      const subscriptions = client
        .db(NEXT_PUBLIC_MONGODB_DB)
        .collection('subscriptions');
      const userSubscriptions = await subscriptions
        .find({ 'partner.slug': partner.slug })
        .toArray();

      const transactions = client
        .db(NEXT_PUBLIC_MONGODB_DB)
        .collection('transactions');
      const userTransactions = await transactions
        .find({ custom_str3: partner._id.toString() })
        .toArray();

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'success',
          data: {
            partner,
            subscriptions: userSubscriptions,
            transactions: userTransactions,
          },
        }),
      };
    } else {
      console.log('** [LOGIN NPO ] Partner not found or invalid password');
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: 'Invalid credentials',
          error: true,
        }),
      };
    }
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Couldn't login", error: true }),
    };
  }
};
