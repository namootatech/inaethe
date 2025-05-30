const { MongoClient } = require('mongodb');

const NEXT_PUBLIC_MONGODB_DB = process.env.NEXT_PUBLIC_MONGODB_DB;
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
    const { userId } = JSON.parse(event.body);

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing user ID' }),
      };
    }

    await client.connect();
    const database = client.db(process.env.NEXT_PUBLIC_MONGODB_DB);
    const collection = database.collection('blogPosts');

    const userBlogPosts = await collection
      .find({ 'author.id': userId })
      .toArray();

    if (userBlogPosts.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'No blog posts found for this user',
          data: [],
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'User blog posts fetched successfully',
        data: userBlogPosts,
      }),
    };
  } catch (error) {
    console.error(
      '** [GET USER BLOG POSTS FUNCTION] Error fetching user blog posts:',
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
