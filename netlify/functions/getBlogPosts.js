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
    const { page, limit } = JSON.parse(event.body);
    console.log(
      `** [GET BLOG POSTS FUNCTION] Parsing request body...${page} and limit: ${limit}`
    );

    if (!page || !limit) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: `Missing page: ${page} and limit: ${limit}`,
        }),
      };
    }

    await client.connect();
    const database = client.db(process.env.NEXT_PUBLIC_MONGODB_DB);
    const collection = database.collection('blogPosts');

    const userBlogPosts = await collection
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    if (userBlogPosts.length === 0) {
      console.error('** [GET  BLOG POSTS FUNCTION] No blog posts found', {
        page,
        limit,
      });
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'No blog posts found for this user',
          data: [],
        }),
      };
    }

    console.log(
      '** [GET BLOG POSTS FUNCTION] Blog posts fetched successfully',
      userBlogPosts.length
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'User blog posts fetched successfully',
        data: userBlogPosts,
      }),
    };
  } catch (error) {
    console.error(
      '** [GET BLOG POSTS FUNCTION] Error fetching user blog posts:',
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
