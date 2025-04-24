const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI; // MongoDB connection string
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    await client.connect();
    const database = client.db(process.env.NEXT_PUBLIC_MONGODB_DB);
    const collection = database.collection('blogPosts');

    const publicBlogPosts = await collection
      .find({ visibility: 'public' })
      .toArray();

    if (publicBlogPosts.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'No public blog posts found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ blogPosts: publicBlogPosts }),
    };
  } catch (error) {
    console.error(
      '** [GET ALL PUBLIC BLOG POSTS FUNCTION] Error fetching public blog posts:',
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
