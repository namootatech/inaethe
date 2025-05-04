const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const NEXT_PUBLIC_MONGODB_DB = process.env.NEXT_PUBLIC_MONGODB_DB;

exports.handler = async (event, context) => {
  const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const usersCollection = client
      .db(NEXT_PUBLIC_MONGODB_DB)
      .collection('blogPosts');
    console.log('** [UPDATE BLOG POST FUNCTION] Parsing request body...');
    // Parse user data from the body
    const body = JSON.parse(event.body);
    const { postId, data } = body;

    if (!postId) {
      console.error(
        '** [UPDATE BLOG POST FUNCTION] Missing required fields in request body.',
        { postId, data }
      );
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Post ID is required',
          error: true,
        }),
      };
    }

    // Update user document
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $set: data }
    );

    if (result.matchedCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Post not found',
          error: true,
        }),
      };
    }

    console.log('** [UPDATE BLOG POST FUNCTION] Post updated successfully');

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Post updated successfully',
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
