import { MongoClient } from 'mongodb';
import Twitter from 'twitter';

import { fetchTweets, LastSavedTweet } from '../utils/twitter';

const MONGODB_URI = 'mongodb://localhost';
const MONGODB_DATABASE = 'colorofberlin';
const MONGODB_COLLECTION = 'tweets';

(async () => {
  const client: MongoClient = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();

    const database = client.db(MONGODB_DATABASE);
    const collection = database.collection(MONGODB_COLLECTION);

    let lastSavedTweet: LastSavedTweet | undefined;

    await collection.aggregate([
      { $addFields: { convertedDate: { $toDate: '$created_at' } } },
      { $sort: { convertedDate: -1 } },
      { $limit: 1 },
      { $project: { _id: 0, id: 1, created_at: 1 } }
    ]).forEach((item) => {
      lastSavedTweet = item;
    });

    if (lastSavedTweet) {
      console.log(`Fetch tweets since '${lastSavedTweet.id}' posted at '${lastSavedTweet.created_at}'`);
    } else {
      console.log('Fetch all tweets');
    }

    const data: Twitter.ResponseData[] = await fetchTweets(lastSavedTweet);

    if (data.length > 0) {
      await collection.insertMany(data);
      console.log(`Saved to MongoDB '${MONGODB_DATABASE}.${MONGODB_COLLECTION}'`);
    }
  } catch (error) {
    console.error(`Save to MongoDB failed: ${error.message}`);
  } finally {
    await client.close();
  }
})();
