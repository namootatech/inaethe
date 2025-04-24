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

module.exports = {
  getFileContent,
  createOrUpdateFile,
};
