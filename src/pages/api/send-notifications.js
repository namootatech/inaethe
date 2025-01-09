import clientPromise from '@/util/mongo';
import { ObjectId } from 'mongodb';
const { App } = require('@slack/bolt');

const isDevEnvironment = process.env.NODE_ENV === 'development';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const client = await clientPromise;
    const db = client.db(process.env.NEXT_PUBLIC_MONGODB_DB);
    const collection = db.collection('users');
    console.log('Request', req.body);
    console.log('TOKEN ', process.env.NEXT_PUBLIC_SLACK_BOT_TOKEN);
    console.log(
      'SIGNING SECRET ',
      process.env.NEXT_PUBLIC_CLIENT_SIGNING_SECRET
    );
    const app = new App({
      signingSecret: process.env.NEXT_PUBLIC_CLIENT_SIGNING_SECRET,
      token: process.env.NEXT_PUBLIC_SLACK_BOT_TOKEN,
    });
    const user = req.body;

    try {
      if (user.email) {
        console.log('finding parent', user.parent, new ObjectId(user.parent));
        const parent = await collection.findOne({
          _id: new ObjectId(user.parent),
        });
        console.log('Parent', parent);
        const blocks = [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: 'New Subscriber',
              emoji: true,
            },
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Name:*\n${user.firstName} ${user.lastName} `,
              },
              {
                type: 'mrkdwn',
                text: `*Subscribed As:*\n${user.subscriptionTier}`,
              },
            ],
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Subscribed To*\n ${user.partner.name}`,
              },
              {
                type: 'mrkdwn',
                text: `*Amount:* \n R${user.amount} `,
              },
            ],
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Subscribed under:* \n${
                user.parent
                  ? parent
                    ? parent.firstName + ' ' + parent.lastName
                    : 'Themself'
                  : 'Themself'
              }`,
            },
          },
        ];
        console.log('Sending message to Slack');
        await app.client.chat.postMessage({
          token: process.env.SLACK_BOT_TOKEN,
          channel: isDevEnvironment ? 'notif-test' : 'general',
          text: 'New Subscriber',
          blocks,
        });
      }
    } catch (e) {
      console.log('Error', e);
    }
  } else {
    res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }
}
