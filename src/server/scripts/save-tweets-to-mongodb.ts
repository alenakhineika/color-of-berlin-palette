import { MongoClient } from 'mongodb';
import Twitter from 'twitter';

import fetchTweets from '../utils/twitter';

const URI = 'mongodb://localhost';
const DATABASE = 'colorofberlin';
const COLLECTION = 'tweets';

(async () => {
  const client: MongoClient = new MongoClient(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const data: Twitter.ResponseData[] = await fetchTweets();

  if (data.length > 0) {
    try {
      await client.connect();
  
      const database = client.db(DATABASE);
      const collection = database.collection(COLLECTION);
  
      await collection.insertMany(data);
  
      console.log(`Tweets saved to MongoDB namespace ${DATABASE}.${COLLECTION}`);
    } catch (error) {
      console.error(`Save to MongoDB failed: ${error.message}`);
    } finally {
      await client.close();
    }
  }
})();
