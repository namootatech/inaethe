const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI; // MongoDB connection string
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
    const { title, content, author, visibility, excerpt, tags } = JSON.parse(
      event.body
    );

    if (!title || !content || !author) {
      console.error(
        '** [ADD BLOG POST FUNCTION] Missing required fields in request body.'
      );
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    await client.connect();
    const database = client.db('blogDatabase');
    const collection = database.collection('blogPosts');

    const blogPost = {
      title,
      content,
      author,
      visibility,
      excerpt,
      tags,
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
