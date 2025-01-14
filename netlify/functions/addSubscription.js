const { MongoClient, ObjectId } = require('mongodb');
const slackNotifications = require('./notifications/slack/notifications');
const {
  sendSubscriptionsWelcomeEmail,
} = require('./notifications/email/notifications');
require('dotenv').config();

const SELECTED_DB = process.env.SELECTED_DB;

exports.handler = async (event, context) => {
  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const usersCollection = client.db(SELECTED_DB).collection('users');
    const subscriptionsCollection = client
      .db(SELECTED_DB)
      .collection('subscriptions');

    // Parse subscription data from body
    const data = JSON.parse(event.body);
    const {
      _id,
      email,
      firstName,
      lastName,
      parent,
      subscriptionTier,
      amount,
      partner,
    } = data;

    if (
      !_id ||
      !email ||
      !firstName ||
      !lastName ||
      !parent ||
      !subscriptionTier ||
      !amount
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
      userId: new ObjectId(_id),
      email,
      firstName,
      lastName,
      level: subscriptionTier,
      status: 'active',
      date: new Date(),
      partner,
      subscriptionTier,
      amount,
      parentId: parent,
      userType: 'existing-user',
    };

    // Save subscription to database
    const result = await subscriptionsCollection.insertOne(subscription);

    // Fetch parent user for Slack notification
    const parentUser = await usersCollection.findOne({
      _id: new ObjectId(parent),
    });

    // Send Slack notification
    await slackNotifications.notifyNewSubscription(data, parentUser, true);

    // Send subscription welcome email
    await sendSubscriptionsWelcomeEmail(client, data);

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
