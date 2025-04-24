const { MongoClient, ObjectId } = require('mongodb');

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
    const { id } = event.body;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing blog post ID' }),
      };
    }

    await client.connect();
    const database = client.db(process.env.NEXT_PUBLIC_MONGODB_DB);
    const collection = database.collection('blogPosts');

    const blogPost = await collection.findOne({ _id: new ObjectId(id) });

    if (!blogPost) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Blog post not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ content: blogPost.content }),
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
