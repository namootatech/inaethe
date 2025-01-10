import fetch from 'node-fetch';
import { execSync } from 'child_process';

async function sendWhatsAppNotification(eventType, payload) {
  console.log('event Type');
  console.log('Payload keys', Object.keys(payload));
  const url = 'https://api.ultramsg.com/instance103711/messages/chat';
  const token = 'ewnmq9tmspauzmm6';
  const to = '+27603116777';

  // Fetch Git details
  const gitDetails = getGitDetails();

  // Generate a dynamic message based on the event type and Git details
  const body = generateMessage(eventType, payload, gitDetails);

  const params = new URLSearchParams();
  params.append('token', token);
  params.append('to', to);
  params.append('body', body.trim());
  params.append('priority', '1');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    const result = await response.text();
    console.log('Notification Sent:', result);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

function generateMessage(eventType, payload, gitDetails) {
  console.log('Payload', payload);
  switch (eventType) {
    case 'push':
      return `
📢 *Push Event*
👤 *Author*: ${payload.pusher.name || gitDetails.author}
📝 *Message*: ${payload.head_commit.message || gitDetails.message}
🔗 *Commit*: ${payload.head_commit.url || gitDetails.hash}
🌐 *Repository*: ${payload.repository.full_name}
      `;

    case 'issues':
      return `
📢 *Issue Event*: ${payload.action}
👤 *User*: ${payload.issue.user.login}
📝 *Title*: ${payload.issue.title}
🔗 *URL*: ${payload.issue.html_url}
🌐 *Repository*: ${payload.repository.full_name}
      `;

    case 'pull_request':
      return `
📢 *Pull Request Event*: ${payload.action}
👤 *User*: ${payload.pull_request.user.login}
📝 *Title*: ${payload.pull_request.title}
🔗 *URL*: ${payload.pull_request.html_url}
🌐 *Repository*: ${payload.repository.full_name}
      `;

    default:
      return `
📢 *${eventType} Event*
Event details: ${JSON.stringify(payload, null, 2)}
🔗 *Git Commit*: ${gitDetails.hash}
👤 *Author*: ${gitDetails.author}
📝 *Message*: ${gitDetails.message}
      `;
  }
}

function getGitDetails() {
  try {
    const author = execSync("git log -1 --pretty=format:'%an'")
      .toString()
      .trim();
    const message = execSync("git log -1 --pretty=format:'%s'")
      .toString()
      .trim();
    const hash = execSync("git log -1 --pretty=format:'%H'").toString().trim();
    return { author, message, hash };
  } catch (error) {
    console.error('Error fetching Git details:', error);
    return { author: 'Unknown', message: 'Unknown', hash: 'Unknown' };
  }
}

// Parse inputs passed to the script
const eventType = process.argv[2]; // e.g., 'push', 'issues', 'pull_request'
const payloadPath = process.argv[3]; // Path to a JSON file containing the payload
console.log('PR', process.env.EVENT_PAYLOAD.number);
// Ensure both arguments are provided
if (!eventType || !payloadPath) {
  console.error('Usage: node sendNotification.js <eventType> <payloadPath>');
  process.exit(1);
}

// Load the payload from the provided path
import fs from 'fs';

let payload;
try {
  payload = JSON.parse(process.env.EVENT_PAYLOAD);
  console.log(process.env.EVENT_PAYLOAD.pull_request);
} catch (error) {
  console.error('Error reading or parsing payload file:', error);
  process.exit(1);
}

// Call the notification function
sendWhatsAppNotification(eventType, payload).catch((error) =>
  console.error('Error executing notification:', error)
);
