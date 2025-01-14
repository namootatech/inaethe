const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const SELECTED_DB = process.env.SELECTED_DB;

exports.handler = async (event, context) => {
  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const usersCollection = client.db(SELECTED_DB).collection('users');

    // Parse user data from the body
    const user = JSON.parse(event.body);
    const { _id, ...updateData } = user;

    if (!_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'User ID is required',
          error: true,
        }),
      };
    }

    // Update user document
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'User not found',
          error: true,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'User updated successfully',
        result,
      }),
    };
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error updating user',
        error: true,
      }),
    };
  } finally {
    await client.close();
  }
};
