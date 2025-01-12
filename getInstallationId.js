#!/usr/bin/env node

const fetch = require('node-fetch'); // Ensure this package is installed

/**
 * Fetches the installation ID matching the specified account login.
 * @param {string} token - The GitHub API token.
 * @param {string} login - The account login to match in the installation list.
 * @returns {Promise<number>} - The matching installation ID.
 * @throws {Error} - Throws an error if the installation is not found or the request fails.
 */
async function getInstallationId(token, login) {
  const apiUrl = 'https://api.github.com/orgs/namootatech/installations';

  try {
    // Perform the API request
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      const data = await response.json();
      console.log(data);
      throw new Error(`HTTP error : ${response.message}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // if (data && Array.isArray(data.installations)) {
    //   data.installations.map((i) =>
    //     console.log('SLUG: ', i.app_slug, ' --- ID:', i.id)
    //   );
    // }

    // Find the installation matching the account login
    const matchingInstallation = data.installations.find(
      (app) => app.app_slug === login
    );

    if (!matchingInstallation) {
      throw new Error(`No installation found for account login: ${login}`);
    }

    // Return the installation ID
    return matchingInstallation.id;
  } catch (error) {
    console.error('Error fetching installation ID:', error.message);
    throw error;
  }
}

// Main logic to handle CLI arguments
(async () => {
  const [token, login] = process.argv.slice(2);

  if (!token || !login) {
    console.error('Usage: ./getInstallationId.js <TOKEN> <LOGIN>');
    process.exit(1);
  }

  try {
    const installationId = await getInstallationId(token, login);
    //console.log(`Installation ID for login "${login}": ${installationId}`);
    console.log(installationId);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
})();
