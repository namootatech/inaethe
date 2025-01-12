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
    console.log('** [ADD CONFIG FUNCTION] Parsing request body...');
    const { orgName, config, customDomain } = JSON.parse(event.body);

    if (!orgName || !config || !customDomain) {
      console.error(
        '** [ADD CONFIG FUNCTION] Missing required fields in request body.'
      );
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    const configFileName = `${orgName}.json`;
    const repoPath = '/tmp/inaethe-repo'; // Temporary clone directory
    const themesDirPath = path.join(repoPath, 'public/themes');
    const configFilePath = path.join(themesDirPath, configFileName);

    // Step 1: Clone the repository
    await executeCommand(`rm -rf ${repoPath}`);
    await executeCommand(`ls`);
    console.log('** [ADD CONFIG FUNCTION] Cloning repository...');
    await executeCommand(
      `pwd &&
      git clone https://github.com/namootatech/inaethe.git ${repoPath}
      cd ${repoPath} &&
      git checkout main &&
       git status
       git pull origin main`
    );
    console.log(
      '** [ADD CONFIG FUNCTION] Repository cloned successfully to:',
      repoPath
    );

    // Step 2: Ensure the public/themes directory exists
    console.log('** [ADD CONFIG FUNCTION] Ensuring themes directory exists...');
    if (!fs.existsSync(themesDirPath)) {
      fs.mkdirSync(themesDirPath, { recursive: true });
      console.log(
        '** [ADD CONFIG FUNCTION] Created missing directory:',
        themesDirPath
      );
    }

    // Step 3: Write the config file
    console.log(
      `** [ADD CONFIG FUNCTION] Writing config file: ${configFileName}`
    );
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
    console.log(
      '** [ADD CONFIG FUNCTION] Config file written successfully at:',
      configFilePath
    );

    // Step 4: Commit and push the new config file
    console.log('** [ADD CONFIG FUNCTION] Committing and pushing changes...');
    await executeCommand(
      `
      cd ${repoPath} &&
      git add public/themes/${configFileName}
     `
    );
    // Step 4: Commit and push the new config file
    console.log('** [ADD CONFIG FUNCTION] Preparing to commit changes...');
    try {
      const stagedFiles = await executeCommand(
        `
    cd ${repoPath} &&
    git diff --cached --name-only
    `
      );

      if (!stagedFiles.includes(`public/themes/${configFileName}`)) {
        console.warn(
          `** [ADD CONFIG FUNCTION] File ${configFileName} is not staged. Skipping commit.`
        );
      } else {
        await executeCommand(
          `
      cd ${repoPath} &&
      git commit -m "Add config for ${orgName}"
      `
        );
        console.log('** [ADD CONFIG FUNCTION] Changes committed successfully.');
      }
    } catch (error) {
      console.error(
        `** [ADD CONFIG FUNCTION] Failed to commit changes for ${orgName}.\nReason:`,
        error.message
      );
      throw error; // Re-throw to propagate error handling
    }

    // Step 4: Commit and push the new config file
    console.log('** [ADD CONFIG FUNCTION] Committing and pushing changes...');
    try {
      // Try pushing changes
      await executeCommand(`
    cd ${repoPath} &&
    git push origin main
  `);
      console.log(
        '** [ADD CONFIG FUNCTION] Changes committed and pushed successfully.'
      );
    } catch (pushError) {
      if (pushError.includes('non-fast-forward')) {
        console.warn(
          '** [ADD CONFIG FUNCTION] Push failed: Non-fast-forward. Attempting to pull and re-apply changes...'
        );

        // Pull latest changes and merge them
        await executeCommand(`
      cd ${repoPath} &&
      git pull origin main --rebase
    `);

        // Push the changes again after rebasing
        await executeCommand(`
      cd ${repoPath} &&
      git push origin main
    `);
        console.log(
          '** [ADD CONFIG FUNCTION] Changes pushed successfully after resolving conflicts.'
        );
      } else {
        console.error(
          '** [ADD CONFIG FUNCTION] Push failed for an unknown reason:',
          pushError
        );
        throw pushError; // Rethrow if it’s not a fast-forward issue
      }
    }

    console.log(
      '** [ADD CONFIG FUNCTION] Changes committed and pushed successfully.'
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Configuration added and sub-site deployed for ${orgName}.`,
      }),
    };
  } catch (error) {
    console.error('** [ADD CONFIG FUNCTION] Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

// Helper function to execute shell commands
const executeCommand = (cmd) => {
  console.log(`** [ADD CONFIG FUNCTION] Executing command: ${cmd}`);
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(
          `** [ADD CONFIG FUNCTION] Command failed: ${cmd}\n` +
            `Exit Code: ${error.code || 'N/A'}\n` +
            `Error Output: ${stderr.trim() || 'N/A'}\n` +
            `Standard Output: ${stdout.trim() || 'N/A'}`
        );
        reject(
          new Error(
            `Command "${cmd}" failed with code ${error.code || 'N/A'}.\n` +
              `Error Output: ${stderr.trim() || 'N/A'}`
          )
        );
      } else {
        console.log(
          `** [ADD CONFIG FUNCTION] Command succeeded: ${cmd}\nOutput:`,
          stdout.trim()
        );
        resolve(stdout.trim());
      }
    });
  });
};
