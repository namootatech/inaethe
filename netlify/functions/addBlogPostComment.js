const { MongoClient } = require('mongodb');

const NEXT_PUBLIC_MONGODB_DB = process.env.NEXT_PUBLIC_MONGODB_DB; // MongoDB connection string
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
    console.log('** [ADD BLOG POST FUNCTION] Parsing request body...');
    const { postId, content, user } = JSON.parse(event.body);

    if (!postId || !content || !user) {
      console.error(
        '** [ADD BLOG POST FUNCTION] Missing required fields in request body.',
        { title, content, author, visibility, excerpt, tags }
      );
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    await client.connect();
    const database = client.db(NEXT_PUBLIC_MONGODB_DB);
    const collection = database.collection('blogPostComments');

    const blogPost = {
      postId,
      content,
      user,
      createdAt: new Date().toISOString(),
    };

    const result = await collection.insertOne(blogPost);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Blog post added successfully',
        blogPostId: result.insertedId,
      }),
    };
  } catch (error) {
    console.error('** [ADD BLOG POST FUNCTION] Error adding blog post:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  } finally {
    await client.close();
  }
};
