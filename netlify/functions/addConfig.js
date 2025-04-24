import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Utility functions for interacting with GitHub API
 */

/**
 * Get content of a file from GitHub repository
 *
 * @param {Object} octokit - Initialized Octokit client
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} path - File path in the repository
 * @param {string} branch - Branch name
 * @returns {Promise<Object>} - File content and metadata
 */
async function getFileContent(octokit, owner, repo, path, branch = 'main') {
  try {
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });

    return {
      content: Buffer.from(response.data.content, 'base64').toString(),
      sha: response.data.sha,
    };
  } catch (error) {
    // Rethrow with status for easier error handling
    if (error.status) {
      throw error;
    }
    throw new Error(`Failed to get file content: ${error.message}`);
  }
}

/**
 * Create or update a file in GitHub repository
 *
 * @param {Object} octokit - Initialized Octokit client
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} path - File path in the repository
 * @param {string} content - File content (plain text)
 * @param {string} message - Commit message
 * @param {string} branch - Branch name
 * @param {string} [sha] - File SHA (required for updating existing files)
 * @returns {Promise<Object>} - GitHub API response
 */
async function createOrUpdateFile(
  octokit,
  owner,
  repo,
  path,
  content,
  message,
  branch = 'main',
  sha = null
) {
  try {
    const params = {
      owner,
      repo,
      path,
      message,
      content: Buffer.from(content).toString('base64'),
      branch,
    };

    // If SHA is provided, it's an update operation
    if (sha) {
      params.sha = sha;
    }

    return await octokit.repos.createOrUpdateFileContents(params);
  } catch (error) {
    console.error('GitHub API error:', error.response?.data || error.message);

    // Handle specific errors
    if (error.status === 409) {
      throw new Error(
        'Conflict: The branch has been updated since you last fetched it.'
      );
    }

    // Rethrow with status for easier error handling
    if (error.status) {
      throw error;
    }
    throw new Error(`Failed to create/update file: ${error.message}`);
  }
}

// GitHub configuration
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
const ORG_NAME = 'namootatech'; // Organization name
const REPO_NAME = 'inaethe';
const BRANCH = 'main';
const CONFIG_PATH = 'public/siteConfigs';

exports.handler = async (event) => {
  console.log('** [ADD CONFIG FUNCTION] Function started');

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Validate GitHub token
  if (!GITHUB_TOKEN) {
    console.error(
      '** [ADD CONFIG FUNCTION] Missing GITHUB_TOKEN environment variable'
    );
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Server configuration error: Missing GitHub organization token',
      }),
    };
  }

  try {
    // Parse request body
    console.log('** [ADD CONFIG FUNCTION] Parsing request body...');
    const { orgName, config } = JSON.parse(event.body);

    // Validate required fields
    if (!orgName || !config) {
      console.error(
        '** [ADD CONFIG FUNCTION] Missing required fields in request body'
      );
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing required fields: orgName and config are required',
        }),
      };
    }

    // Initialize GitHub client with organization access
    const octokit = new Octokit({
      auth: GITHUB_TOKEN,
      baseUrl: 'https://api.github.com',
    });

    // Verify organization access
    try {
      await octokit.orgs.get({ org: ORG_NAME });
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        return {
          statusCode: 401,
          body: JSON.stringify({
            error: 'Invalid or insufficient organization token permissions',
          }),
        };
      }
      throw error;
    }

    const configFileName = `${orgName}.json`;
    const filePath = `${CONFIG_PATH}/${configFileName}`;

    console.log(
      `** [ADD CONFIG FUNCTION] Preparing to update file: ${filePath}`
    );

    // Get the current file (if it exists) to get its SHA
    let currentFileSha;
    try {
      const fileData = await getFileContent(
        octokit,
        ORG_NAME,
        REPO_NAME,
        filePath,
        BRANCH
      );
      currentFileSha = fileData.sha;
      console.log(
        `** [ADD CONFIG FUNCTION] Existing file found with SHA: ${currentFileSha}`
      );
    } catch (error) {
      if (error.status === 404) {
        console.log(
          `** [ADD CONFIG FUNCTION] File doesn't exist yet, will create new file`
        );
      } else {
        throw error;
      }
    }

    // Create or update the file in the repository
    const configContent = JSON.stringify(config, null, 2);
    const result = await createOrUpdateFile(
      octokit,
      ORG_NAME,
      REPO_NAME,
      filePath,
      configContent,
      `::auto-deploy:: ${orgName}`,
      BRANCH,
      currentFileSha
    );

    console.log(
      `** [ADD CONFIG FUNCTION] File successfully ${
        currentFileSha ? 'updated' : 'created'
      }`
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Configuration ${
          currentFileSha ? 'updated' : 'added'
        } and sub-site deployed for ${orgName}`,
        fileUrl: result?.content?.html_url,
      }),
    };
  } catch (error) {
    console.error('** [ADD CONFIG FUNCTION] Error:', error);

    // Provide more detailed error message based on error type
    let errorMessage = error.message;
    if (error.status === 401) {
      errorMessage =
        'GitHub authentication failed. Check your organization token permissions.';
    } else if (error.status === 403) {
      errorMessage =
        'GitHub API rate limit exceeded or insufficient organization permissions.';
    } else if (error.status === 404) {
      errorMessage = 'Repository or file path not found in the organization.';
    } else if (error.status === 409) {
      errorMessage = 'Conflict occurred. The branch might have been updated.';
    }

    return {
      statusCode: error.status || 500,
      body: JSON.stringify({
        error: errorMessage,
        details: error.response?.data || 'No additional details available',
      }),
    };
  }
};
