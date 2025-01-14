const { App } = require('@slack/bolt');
require("dotenv").config();

const app = new App({
  signingSecret: process.env.CLIENT_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

const sendSlackNotification = async (title, blocks, channel) => 
      await app.client.chat.postMessage({
        token: process.env.SLACK_BOT_TOKEN,
        channel: channel,
        text: title,
        blocks,
      });

module.exports = sendSlackNotification;