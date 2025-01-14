const sendSlackNotification  = require('./index') ;

const isDevEnvironment = process.env.NODE_ENV === 'development';

const notifyNewSubscription = async (data, parent) => {
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
              text: `*Name:*\n${data.firstName} ${data.lastName} `,
            },
            {
              type: 'mrkdwn',
              text: `*Subscribed As:*\n${data.subscriptionTier}`,
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Subscribed To*\n ${data.partner.name}`,
            },
            {
              type: 'mrkdwn',
              text: `*Amount:* \n R${data.amount} `,
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Subscribed under:* \n${
              data.parent
                ? parent
                  ? parent.firstName + ' ' + parent.lastName
                  : 'Themself'
                : 'Themself'
            }`,
          },
        },
      ]
      await sendSlackNotification('New Subscriber', blocks, isDevEnvironment ? 'notif-test' : 'notifications');
}

module.exports = {
    notifyNewSubscription
}

