const { MongoClient, ObjectId } = require('mongodb');
const slackNotifications = require('./notifications/slack/notifications');
const {
  sendSubscriptionsWelcomeEmail,
} = require('./notifications/email/notifications');
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
    const subscriptionsCollection = client
      .db(NEXT_PUBLIC_MONGODB_DB)
      .collection('subscriptions');

    // Parse subscription data from body
    const data = JSON.parse(event.body);
    const {
      userId,
      email,
      firstName,
      lastName,
      subscriptionTier,
      amount,
      partner,
      parentId,
      level,
    } = data;

    console.log('** [ADD SUBSCRIPTION FUNCTION] Received request');
    console.log('** [ADD SUBSCRIPTION FUNCTION] Data:', data);

    if (
      !userId ||
      !email ||
      !firstName ||
      !lastName ||
      !parentId ||
      !subscriptionTier ||
      !amount ||
      !level
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Missing required fields',
          error: true,
        }),
      };
    }

    // Create subscription object
    const subscription = {
      userId: new ObjectId(userId),
      email,
      firstName,
      lastName,
      level,
      status: 'active',
      createdDate: new Date(),
      partner,
      subscriptionTier,
      amount,
      parentId: parentId || 'noparent',
    };

    // Save subscription to database
    const result = await subscriptionsCollection.insertOne(subscription);

    // Fetch parent user for Slack notification
    // I commentwed th9is out because sometimes parentId is not an object id but the string noparent
    // const parentUser = await usersCollection.findOne({
    //   _id: new ObjectId(parentId),
    // });

    // // Send Slack notification
    // await slackNotifications.notifyNewSubscription(data, parentUser, true);

    // Send subscription welcome email
    // await sendSubscriptionsWelcomeEmail(client, data);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Subscription added successfully',
        subscription: result,
      }),
    };
  } catch (error) {
    console.error('Error adding subscription:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error adding subscription',
        error: true,
      }),
    };
  } finally {
    await client.close();
  }
};
