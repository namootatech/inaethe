const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.NEXT_PUBLIC_MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { postId } = JSON.parse(event.body);

    if (!postId) {
      console.error(
        '** [GET BLOG POST CONTENT FUNCTION] Missing required fields in request body.',
        { postId }
      );
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: `Missing blog post ID ${postId}`,
          message: 'Blog post ID is required',
          data: null,
        }),
      };
    }

    await client.connect();
    const database = client.db(process.env.NEXT_PUBLIC_MONGODB_DB);
    const collection = database.collection('blogPostComments');

    const blogPost = await collection.find({ postId }).toArray();

    if (!blogPost) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Blog post not found',
          data: null,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Blog post fetched successfully',
        data: blogPost,
      }),
    };
  } catch (error) {
    console.error(
      '** [GET BLOG POST CONTENT FUNCTION] Error fetching blog post content:',
      error
    );
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  } finally {
    await client.close();
  }
};
