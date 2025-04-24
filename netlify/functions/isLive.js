const { MongoClient } = require('mongodb');
require('dotenv').config();

const NEXT_PUBLIC_MONGODB_DB = process.env.NEXT_PUBLIC_MONGODB_DB;

exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      isLive: true,
    }),
  };
};
