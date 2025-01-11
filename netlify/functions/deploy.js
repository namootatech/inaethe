const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse request body
    const { orgName, config, customDomain } = JSON.parse(event.body);

    if (!orgName || !config || !customDomain) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    const configFileName = `${orgName}.json`;
    const repoPath = '/tmp/inaethe-repo'; // Temporary clone directory
    const configFilePath = path.join(repoPath, 'public/themes', configFileName);

    // Step 1: Clone the repository
    console.log('Cloning repository...');
    await executeCommand(
      `git clone https://github.com/your-org/inaethe.git ${repoPath}`
    );

    // Step 2: Write the config file to the public/themes folder
    console.log(`Writing config file: ${configFileName}`);
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));

    // Step 3: Commit and push the new config file
    console.log('Committing and pushing changes...');
    await executeCommand(
      `
      cd ${repoPath} &&
      git add public/themes/${configFileName} &&
      git commit -m "Add config for ${orgName}" &&
      git push origin main
    `
    );

    // Optional: Step 4: Trigger GitHub Actions or Netlify CLI to deploy a sub-site
    console.log(`Deploying sub-site for ${orgName}...`);
    await executeCommand(
      `
      netlify sites:create --name ${orgName} --custom-domain ${customDomain} &&
      netlify deploy --prod --dir=${repoPath}/out
    `
    );

    console.log('Sub-site deployed successfully!');

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Configuration added and sub-site deployed for ${orgName}.`,
      }),
    };
  } catch (error) {
    console.error('Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

// Helper function to execute shell commands
const executeCommand = (cmd) => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout.trim());
      }
    });
  });
};
