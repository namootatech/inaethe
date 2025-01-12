import fetch from 'node-fetch';

async function sendWhatsAppNotification(
  author,
  message,
  hash,
  repo,
  branch,
  date
) {
  const url = 'https://api.ultramsg.com/instance103711/messages/chat';
  const token = 'ewnmq9tmspauzmm6';
  const to = '120363389265603372@g.us';

  const body = `
📢 *Make way for a new commit 😎🙆‍♀️ *
😤 *Author*: ${author}
📝 *Message*: ${message}
🤝 *Commit Hash*: ${hash}
🌐 *Repository*: ${repo}
👊 *Branch*: ${branch}
⏰ *Date*: ${date}

🔗 Inspect 👀: https://github.com/namootatech/${repo}/commit/${hash}
  `;

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

// Retrieve commit details from the environment variables
const author = process.env.GIT_AUTHOR;
const message = process.env.GIT_MESSAGE;
const hash = process.env.GIT_HASH;
const repo = process.env.GIT_REPO;
const branch = process.env.GIT_BRANCH;
const date = new Date().toISOString(); // Get current timestamp

// Send the notification
sendWhatsAppNotification(author, message, hash, repo, branch, date);
