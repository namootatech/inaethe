const { assoc, omit } = require('ramda');
const bcrypt = require('bcrypt-nodejs');
const { MongoClient, ObjectId } = require('mongodb');
const slackNotifications = require('./notifications/slack/notifications');
const {
  sendSubscriptionsWelcomeEmail,
} = require('./notifications/email/notifications');
require('dotenv').config();

const NEXT_PUBLIC_MONGODB_DB = process.env.NEXT_PUBLIC_MONGODB_DB;

exports.handler = async (event, context) => {
  console.log('** [REGISTERFUNCTION] Start handling request...');
  const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Check HTTP Method
    console.log('** [REGISTERFUNCTION] Checking HTTP method...');
    if (event.httpMethod !== 'POST') {
      console.log(
        '** [REGISTERFUNCTION] Invalid HTTP method. Only POST allowed.'
      );
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
    }

    // Connect to MongoDB
    console.log('** [REGISTERFUNCTION] Connecting to MongoDB...');
    await client.connect();
    console.log('** [REGISTERFUNCTION] MongoDB connected successfully.');

    // Parse request body
    console.log('** [REGISTERFUNCTION] Parsing request body...');
    const data = JSON.parse(event.body);
    console.log('** [REGISTERFUNCTION] Parsed data:', data);

    const { email, password } = data;

    // Check if email already exists
    console.log('** [REGISTERFUNCTION] Checking if email already exists...');
    const users = client.db(NEXT_PUBLIC_MONGODB_DB).collection('users');
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      console.log(`** [REGISTERFUNCTION] Email already exists: ${email}`);
      return {
        statusCode: 409, // Conflict
        body: JSON.stringify({
          message: 'Email already exists',
          error: true,
        }),
      };
    }

    // Hash password
    console.log('** [REGISTERFUNCTION] Hashing user password...');
    const hash = bcrypt.hashSync(password);

    // Create user object
    console.log('** [REGISTERFUNCTION] Creating user object...');
    const user = assoc('hash', hash, data);
    console.log('** [REGISTERFUNCTION] User object created:', user);

    // Insert user into database
    console.log(
      '** [REGISTERFUNCTION] Inserting user into "users" collection...'
    );
    const userResult = await users.insertOne(
      omit(
        ['partner', 'subscriptionTier'],
        assoc('joinedDate', new Date(), user)
      )
    );
    console.log(
      '** [REGISTERFUNCTION] User inserted successfully:',
      userResult
    );

    const userId = userResult.insertedId;

    // Create subscription object
    console.log('** [REGISTERFUNCTION] Creating subscription object...');
    const subscriptions = client
      .db(NEXT_PUBLIC_MONGODB_DB)
      .collection('subscriptions');
    const subscription = {
      userId: userId,
      email,
      firstName: data.firstName,
      lastName: data.lastName,
      level: data.level,
      status: 'active',
      createdDate: new Date(),
      partner: data.partner,
      subscriptionTier: data.subscriptionTier,
      amount: data.amount,
      parentId: data.parent,
    };
    console.log(
      '** [REGISTERFUNCTION] Subscription object created:',
      subscription
    );

    // Insert subscription into database
    console.log(
      '** [REGISTERFUNCTION] Inserting subscription into "subscriptions" collection...'
    );
    const subscriptionResult = await subscriptions.insertOne(subscription);
    console.log(
      '** [REGISTERFUNCTION] Subscription inserted successfully:',
      subscriptionResult
    );

    // Respond to client
    console.log('** [REGISTERFUNCTION] Returning success response...');
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'success',
        user: userId.toString(),
        subscription: subscriptionResult.insertedId.toString(),
      }),
    };

    // Send notifications as an after-effect
    console.log('** [REGISTERFUNCTION] Processing notifications...');
    (async () => {
      try {
        const parent = await users.findOne({ _id: new ObjectId(data.parent) });
        console.log('** [REGISTERFUNCTION] Sending Slack notification...');
        await slackNotifications.notifyNewSubscription(data, parent, false);
        console.log('** [REGISTERFUNCTION] Slack notification sent.');

        console.log(
          '** [REGISTERFUNCTION] Sending subscription welcome email...'
        );
        await sendSubscriptionsWelcomeEmail(client, data);
        console.log('** [REGISTERFUNCTION] Welcome email sent.');
      } catch (notifyError) {
        console.error('** [REGISTERFUNCTION] Notification error:', notifyError);
      }
    })();

    return response;
  } catch (error) {
    console.error('** [REGISTERFUNCTION] Error encountered:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Couldn't save user", error: true }),
    };
  } finally {
    console.log('** [REGISTERFUNCTION] Closing MongoDB connection...');
    await client.close();
    console.log('** [REGISTERFUNCTION] MongoDB connection closed.');
  }
};
