import { MongoClient } from 'mongodb';
import Twitter from 'twitter';

import { fetchTweets } from '../utils/twitter';

const uri = 'mongodb://localhost';

(async () => {
  const client: MongoClient = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    const data: Twitter.ResponseData[] = await fetchTweets();

    await client.connect();

    const database = client.db('colorofberlin');
    const collection = database.collection('tweets');

    await collection.insertMany(data);

    console.log('Save tweets to mongodb', data);
  } catch (error) {
    console.error('Save tweets to mongodb error', error);
  } finally {
    await client.close();
  }
})();
