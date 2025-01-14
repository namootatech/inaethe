const { assoc, omit } = require('ramda');
const bcrypt = require('bcrypt-nodejs');
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
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
    }
    await client.connect();
    const data = JSON.parse(event.body);
    const { email, password } = data;
    const users = client.db(SELECTED_DB).collection('users');
    const hash = bcrypt.hashSync(password);
    const user = assoc('hash', hash, data);
    console.log(user);

    users
      .insertOne(
        omit(
          ['partner', 'subscriptionTier'],
          assoc('joinedDate', new Date(), user)
        )
      )
      .then(async (result) => {
        const userId = result.insertedId;
        const subscriptions = client
          .db(SELECTED_DB)
          .collection('subscriptions');
        const subscription = {
          userid: userId,
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
          userType: 'new-user',
        };
        await subscriptions
          .insertOne(subscription)
          .then((result) => {
            console.log('Subscription saved', result);
            res.status(200).send({
              message: 'success',
              user: userId,
              subscription: result.insertedId.toString(),
            });
          })
          .catch((err) => {
            console.log('Error saving subscription', err);
            res
              .status(500)
              .send({ message: "Couldn't save subscription", error: true });
          });

        const user = req.body;

        const parent = await users.findOne({
          _id: new ObjectId(user.parent),
        });
        await slackNotifications.notifyNewSubscription(user, parent, false);
        await sendSubscriptionsWelcomeEmail(client, user);
      });
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Couldn't save user", error: true }),
    };
  }
};
