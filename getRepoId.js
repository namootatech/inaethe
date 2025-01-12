#!/usr/bin/env node

import fetch from 'node-fetch';

async function getRepoId(token, repoPath) {
  const apiUrl = 'https://api.github.com/repos';

  try {
    // Get repo details
    const repoResponse = await fetch(`${apiUrl}/${repoPath}`, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!repoResponse.ok) {
      const data = await repoResponse.json();
      throw new Error(`HTTP error: ${data.message}`);
    }

    const repoData = await repoResponse.json();
    return repoData.id;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }
}

// Main logic to handle CLI arguments
(async () => {
  const [token, repoPath] = process.argv.slice(2);

  if (!token || !repoPath) {
    console.error('Usage: ./getRepoId.js <TOKEN> <REPO PATH>');
    process.exit(1);
  }

  try {
    const repoId = await getRepoId(token, repoPath);
    console.log(repoId);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
})();
