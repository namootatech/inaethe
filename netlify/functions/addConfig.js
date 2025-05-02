import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

dotenv.config();

const NEXT_PUBLIC_MONGODB_DB = process.env.NEXT_PUBLIC_MONGODB_DB;

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
const ORG_NAME = 'namootatech';
const REPO_NAME = 'inaethe';
const BRANCH = 'main';
const CONFIG_PATH = 'public/siteConfigs';
const API_BASE = 'https://api.github.com';

export const handler = async (event) => {
  const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  if (!GITHUB_TOKEN) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Missing GITHUB_TOKEN environment variable',
      }),
    };
  }

  const headers = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  try {
    const { orgName, config } = JSON.parse(event.body);

    if (!orgName || !config) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing required fields: orgName and config',
        }),
      };
    }

    const configFileName = `${orgName}.json`;
    const filePath = `${CONFIG_PATH}/${configFileName}`;

    // Try to get existing file to get its SHA
    let existingFile;
    try {
      const response = await fetch(
        `${API_BASE}/repos/${ORG_NAME}/${REPO_NAME}/contents/${filePath}?ref=${BRANCH}`,
        { headers }
      );

      if (response.status === 200) {
        existingFile = await response.json();
      } else if (response.status !== 404) {
        throw new Error(`Failed to check file: ${response.statusText}`);
      }
    } catch (error) {
      if (!error.message.includes('404')) {
        throw error;
      }
    }

    // Prepare the request body for creating/updating file
    const requestBody = {
      message: `::auto-deploy:: ${orgName}`,
      content: Buffer.from(JSON.stringify(config, null, 2)).toString('base64'),
      branch: BRANCH,
    };

    if (existingFile) {
      requestBody.sha = existingFile.sha;
    }

    // Create or update file
    const response = await fetch(
      `${API_BASE}/repos/${ORG_NAME}/${REPO_NAME}/contents/${filePath}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }

    const result = await response.json();

    await client.connect();

    const configsCollection = client
      .db(NEXT_PUBLIC_MONGODB_DB)
      .collection('partnerConfigs');

    const existingConfig = await configsCollection.findOne({
      organisationId: orgName,
    });

    if (existingConfig) {
      await configsCollection.updateOne(
        { organisationId: orgName },
        { $set: { config: { ...config, updatedAt: new Date() } } }
      );
    }

    if (!existingConfig) {
      await configsCollection.insertOne({
        organisationId: orgName,
        config,
        createdAt: new Date(),
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Configuration ${
          existingFile ? 'updated' : 'added'
        } successfully`,
        file: result.content.html_url,
      }),
    };
  } catch (error) {
    console.error('Error:', error);

    const errorMessage = error.message.includes('401')
      ? 'Invalid token'
      : error.message.includes('403')
      ? 'Insufficient permissions'
      : error.message.includes('404')
      ? 'Repository not found'
      : error.message;

    return {
      statusCode: error.status || 500,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};
