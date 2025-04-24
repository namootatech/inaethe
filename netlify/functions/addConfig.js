import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

dotenv.config();

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
const ORG_NAME = 'namootatech';
const REPO_NAME = 'inaethe';
const BRANCH = 'main';
const CONFIG_PATH = 'public/siteConfigs';

export const handler = async (event) => {
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

    const octokit = new Octokit({ auth: GITHUB_TOKEN });
    const configFileName = `${orgName}.json`;
    const filePath = `${CONFIG_PATH}/${configFileName}`;

    // Try to get existing file to get its SHA
    let existingFile;
    try {
      const { data } = await octokit.repos.getContent({
        owner: ORG_NAME,
        repo: REPO_NAME,
        path: filePath,
        ref: BRANCH,
      });
      existingFile = data;
    } catch (error) {
      if (error.status !== 404) {
        throw error;
      }
    }

    // Create or update file
    const response = await octokit.repos.createOrUpdateFileContents({
      owner: ORG_NAME,
      repo: REPO_NAME,
      path: filePath,
      message: `::auto-deploy:: ${orgName}`,
      content: Buffer.from(JSON.stringify(config, null, 2)).toString('base64'),
      branch: BRANCH,
      ...(existingFile && { sha: existingFile.sha }),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Configuration ${
          existingFile ? 'updated' : 'added'
        } successfully`,
        file: response.data.content.html_url,
      }),
    };
  } catch (error) {
    console.error('Error:', error);

    const errorMessage =
      error.status === 403
        ? 'Invalid token or insufficient permissions'
        : error.status === 404
        ? 'Repository not found'
        : error.message;

    return {
      statusCode: error.status || 500,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};
