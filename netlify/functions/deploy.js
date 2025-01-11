const { spawn } = require('child_process');
const path = require('path');

const getScript = (url) => `
#!/bin/bash

# Get the URL from the argument
URL=${url}

# Log the URL or process it
echo "Received URL: $URL"

# Example: Use curl to fetch the URL's content (or any other processing)
curl -s "$URL" > ./fetched_content.txt

pwd

echo "URL content saved to /tmp/fetched_content.txt"
`;

exports.handler = async (event) => {
  console.log('** [FUNCTIONS] handling deploy function **');

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse the incoming URL from the request body
    const { url } = JSON.parse(event.body);
    console.log(`** [FUNCTIONS] deploying new site with config url ${url} **`);

    if (!url) {
      console.log(
        `** [FUNCTIONS] Error no config url provided in request body **`
      );
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing URL in request body' }),
      };
    }

    console.log(
      `** [FUNCTIONS] Executing bash script with config url: ${url}.... **`
    );

    // Path to your bash script
    const scriptPath = path.resolve(__dirname, './scripts/deploy.sh');

    // Start the script process
    const process = spawn('bash', ['-c', getScript(url)]);

    // Log output and errors incrementally
    let output = '';
    process.stdout.on('data', (data) => {
      const message = data.toString();
      console.log(`** [FUNCTIONS][stdout]: ${message}`);
      output += message;
    });

    process.stderr.on('data', (data) => {
      const error = data.toString();
      console.error(`** [FUNCTIONS][stderr]: ${error}`);
    });

    // Wait for the process to complete
    const result = await new Promise((resolve, reject) => {
      process.on('close', (code) => {
        if (code === 0) {
          resolve(output.trim());
        } else {
          reject(`Process exited with code ${code}`);
        }
      });
    });

    console.log(`** [FUNCTIONS] Done Deploy. Success. ${url} **`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Script executed successfully', result }),
    };
  } catch (error) {
    console.error(`** [FUNCTIONS] Error: ${error.message} **`);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
