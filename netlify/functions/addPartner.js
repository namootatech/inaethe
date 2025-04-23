const { MongoClient } = require('mongodb');
const { assoc, omit } = require('ramda');
const bcrypt = require('bcrypt-nodejs');
require('dotenv').config();

const NEXT_PUBLIC_MONGODB_DB = process.env.NEXT_PUBLIC_MONGODB_DB;

exports.handler = async (event, context) => {
  console.log('** [ADD PARTNER FUNCTION] Received request');

  if (event.httpMethod !== 'POST') {
    console.log('** [ADD PARTNER FUNCTION] Invalid HTTP method');
    return {
      statusCode: 405,
      body: JSON.stringify({
        message: 'Method Not Allowed',
        error: true,
      }),
    };
  }

  const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    console.log('** [ADD PARTNER FUNCTION] Parsing request body');
    const partnerData = JSON.parse(event.body);

    console.log('** [ADD PARTNER FUNCTION] Connecting to database');
    await client.connect();
    const partnersCollection = client
      .db(NEXT_PUBLIC_MONGODB_DB)
      .collection('partners');

    console.log('** [ADD PARTNER FUNCTION] Checking for existing partner');
    const existingPartner = await partnersCollection.findOne({
      $or: [
        { organizationName: partnerData.organizationName },
        { registrationNumber: partnerData.registrationNumber },
      ],
    });

    if (existingPartner) {
      console.log(
        `** [ADD PARTNER FUNCTION] Duplicate found: ${JSON.stringify(
          existingPartner
        )}`
      );
      return {
        statusCode: 409, // Conflict
        body: JSON.stringify({
          message:
            'Organization with the same name or registration number already exists',
          error: true,
        }),
      };
    }
    const { email, password } = partnerData;
    const hash = bcrypt.hashSync(password);
    const partner = assoc('hash', hash, partnerData);
    console.log('** [ADD PARTNER FUNCTION] No duplicate found, inserting data');
    const result = await partnersCollection.insertOne({
      ...partner,
      slug: toKebab(partnerData.organizationName),
    });

    console.log(
      `** [ADD PARTNER FUNCTION] Partner added successfully with ID: ${result.insertedId}`
    );
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Partner added successfully',
        partnerId: result.insertedId,
      }),
    };
  } catch (error) {
    console.error('** [ADD PARTNER FUNCTION] Error adding partner:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error adding partner',
        error: true,
      }),
    };
  } finally {
    console.log('** [ADD PARTNER FUNCTION] Closing database connection');
    await client.close();
  }
};

function toKebab(str) {
  console.log('** [ADD PARTNER FUNCTION] Converting string to kebab case');
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with dashes
    .replace(/^-+|-+$/g, ''); // Trim leading/trailing dashes
}
