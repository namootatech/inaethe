// src/functions/createReferralLink.js
const { MongoClient } = require('mongodb');
const axios = require('axios'); // ✅ Use axios

const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

exports.handler = async (event, context) => {
  console.log('** [CHECK LIVE STATUS FUNCTION] Received request');

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  let url;
  try {
    const body = JSON.parse(event.body);
    url = body.url;
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid JSON in request body' }),
    };
  }

  if (!url) {
    console.log('** [CHECK LIVE STATUS FUNCTION] Missing URL');
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing URL' }),
    };
  }

  try {
    const response = await axios.get(url);
    console.log('** [CHECK LIVE STATUS FUNCTION] Response:', response.status);

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error('** [CHECK LIVE STATUS FUNCTION] Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch URL data' }),
    };
  } finally {
    await client.close();
  }
};
