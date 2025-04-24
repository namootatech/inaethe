#!/usr/bin/env node

import fetch from 'node-fetch'; // Ensure you have this package installed
import 'dotenv';
/**
 * Creates a Netlify site by making a POST request to the Netlify API.
 * @param {string} token - The Netlify API authentication token.
 * @param {string} orgName - The organization name for the site.
 * @param {object} secrets - The secrets to include in the payload.
 */

async function createNetlifySite(
  orgName,
  installation_id,
  repo_id,
  NETLIFY_AUTH_TOKEN,
  NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_PAYFAST_URL,
  NEXT_PUBLIC_WEBSITE_URL,
  NEXT_PUBLIC_MERCHANT_ID,
  NEXT_PUBLIC_MERCHANT_KEY,
  NEXT_PUBLIC_GOOGLE_ANALYTICS,
  NEXT_PUBLIC_MONGODB_URI,
  NEXT_PUBLIC_MONGODB_DB,
  NEXT_PUBLIC_CONFIG_NAME = 'config.json',
  GIT_USER,
  GIT_PASS
) {
  const apiUrl = `https://api.netlify.com/api/v1/sites`;
  const secrets = {
    NETLIFY_AUTH_TOKEN,
    NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_PAYFAST_URL,
    NEXT_PUBLIC_WEBSITE_URL:
      orgName && orgName !== '' && orgName !== 'unknown'
        ? `https://${orgName}.inaethe.co.za`
        : NEXT_PUBLIC_WEBSITE_URL,
    NEXT_PUBLIC_MERCHANT_ID,
    NEXT_PUBLIC_MERCHANT_KEY,
    NEXT_PUBLIC_GOOGLE_ANALYTICS,
    NEXT_PUBLIC_MONGODB_URI,
    NEXT_PUBLIC_MONGODB_DB,
    NEXT_PUBLIC_CONFIG_NAME,
    NEXT_PUBLIC_VERBOSE_LOGGING: 'true',
    GIT_USER,
    GIT_PASS,
  };
  console.log(secrets);

  const environmentVariables = Object.entries(secrets).map(([key, value]) => ({
    key,
    scopes: ['builds', 'functions', 'runtime', 'post_processing'],
    values: [{ context: 'all', value }],
  }));

  const token = NETLIFY_AUTH_TOKEN;
  const payload = {
    account_slug: 'abqwabi',
    name: `${orgName}-inaethe-za`,
    custom_domain: `${orgName}.inaethe.co.za`,
    env: environmentVariables,
    created_via: '',
    repo: {
      provider: 'github',
      installation_id: installation_id,
      id: repo_id,
      repo: 'namootatech/inaethe',
      owner_type: 'Organization',
      private: true,
      branch: 'main',
      framework: 'next',
      frameworkName: 'Next.js',
      dir: '.next',
      frameworkLogo: {
        default: 'https://framework-info.netlify.app/logos/nextjs/light.svg',
        light: 'https://framework-info.netlify.app/logos/nextjs/light.svg',
        dark: 'https://framework-info.netlify.app/logos/nextjs/dark.svg',
      },
      siteName: `${orgName}-inaethe-za`,
      cmd: 'npm run build',
      plugins_installed: [],
      plugins: [{ package: '@netlify/plugin-nextjs' }],
      plugins_recommended: ['@netlify/plugin-nextjs'],
      package_path: '',
    },
  };

  try {
    console.log('Sending request to Netlify API...');
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${JSON.stringify(data)}`);
    }

    console.log('Site creation response:', data);
  } catch (error) {
    console.error('Error creating Netlify site:', error.message);
  }
}

// Main logic to handle CLI arguments
(async () => {
  const args = process.argv.slice(2);

  const [
    orgName,
    installation_id,
    repo_id,
    NETLIFY_AUTH_TOKEN,
    NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_PAYFAST_URL,
    NEXT_PUBLIC_WEBSITE_URL,
    NEXT_PUBLIC_MERCHANT_ID,
    NEXT_PUBLIC_MERCHANT_KEY,
    NEXT_PUBLIC_GOOGLE_ANALYTICS,
    NEXT_PUBLIC_MONGODB_URI,
    NEXT_PUBLIC_MONGODB_DB = 'unknown',
    GIT_USER,
    GIT_PASS,
  ] = args;

  console.log(process.argv);
  console.log('\nArguments:', args);

  console.log('\n\nToken:', NETLIFY_AUTH_TOKEN);
  console.log('Org Name:', orgName);
  console.log('Installation ID:', installation_id);
  console.log('Repository ID:', repo_id);

  if (!installation_id) {
    console.error('Installation ID is required');
    process.exit(1);
  }

  if (!repo_id) {
    console.error('Repository ID is required');
    process.exit(1);
  }

  if (!NETLIFY_AUTH_TOKEN) {
    console.error('Netlify API authentication token is required');
    process.exit(1);
  }

  const randomTwoDigitNumber = Math.floor(Math.random() * 100) + 10;

  await createNetlifySite(
    orgName,
    installation_id,
    repo_id,
    NETLIFY_AUTH_TOKEN,
    NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_PAYFAST_URL,
    NEXT_PUBLIC_WEBSITE_URL,
    NEXT_PUBLIC_MERCHANT_ID,
    NEXT_PUBLIC_MERCHANT_KEY,
    NEXT_PUBLIC_GOOGLE_ANALYTICS,
    NEXT_PUBLIC_MONGODB_URI,
    NEXT_PUBLIC_MONGODB_DB || 'unknown',
    `${orgName}.json` || 'config',
    GIT_USER,
    GIT_PASS
  );
})();
