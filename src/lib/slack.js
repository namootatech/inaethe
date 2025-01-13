import axios from 'axios';
export async function sendMessageToSlack(text) {
  const webhookURL = process.env.SLACK_WEBHOOK_URL;
  const payload = { text };
  try {
    const response = await axios.post(webhookURL, payload);
    return response.status === 200;
  } catch (error) {
    console.error('Error sending message to Slack:', error);
    return false;
  }
}