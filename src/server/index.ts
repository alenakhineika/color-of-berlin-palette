import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import middleware from './middlewares';
import { MongoClient, Db, Collection } from 'mongodb';

const SERVER_PORT = Number(process.env.PORT) || 8050;
const CLIENT_PUBLIC_HTML = '/dist/index.html';
const CLIENT_OUT_DIR = 'dist';
const MONGODB_URI = 'mongodb://localhost';
const MONGODB_DATABASE = 'colorofberlin';
const MONGODB_COLLECTION = 'tweets';

// Instantiate a MongoDB client.
const client: MongoClient = new MongoClient(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let database: Db | undefined;
let collection: Collection | undefined;

(async () => {
  try {
    await client.connect(); // Connect to mongodb://localhost.
    database = client.db(MONGODB_DATABASE); // Access the `colorofberlin` database.
    collection = database.collection(MONGODB_COLLECTION); // Access the `tweets` collection.
  } catch (error) {
    console.error(`Connect to MongoDB failed: ${error.message}`);
  }
})();

const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(CLIENT_OUT_DIR));
app.get('/', (req, res) => res.sendFile(CLIENT_PUBLIC_HTML));

const router = express.Router();

// Listen for requests from the client and for `getTweets` request return 30 recent tweets.
router.get('/getTweets', async (req: Request, res: Response) => {
  // The data format expected by the client.
  let tweets: {
    id: number,
    created_at: string,
    text: string,
    colorHex: string,
    colorName: string
  }[] | [] = [];

  if (collection) {
    // Use aggregation to find 30 recent tweets
    // and modify the resulting array to match the expected data format.
    tweets = await collection.aggregate([
      // Take the created_at field that has a string value and can't be sorted
      // and create a new convertedDate field that has a ISODate value.
      { $addFields: { convertedDate: { $toDate: '$created_at' } } },
      // Sort descending from the most recent tweet to later ones.
      { $sort: { convertedDate: -1 } },
      // Return only 30 recent tweets, not all the tweets that exist in the collection.
      { $limit: 30 },
      // Return only id, created_at and text, not all the fields that a document has.
      { $project: { _id: 0, id: 1, created_at: 1, text: 1 } }
    ]).toArray();

    // A color's hex value and a name are stored inside a text string.
    // Parse the string to extract these values.
    tweets = tweets.map((item) => {
      const textAll = item.text.split('. #');
      const colorHex = `#${textAll[1].substring(0, 6)}`;
      const textWithColorName = textAll[0].split('The color of the sky in Berlin is ');
      const colorName = textWithColorName[1];

      return {
        id: item.id,
        created_at: item.created_at,
        text: item.text,
        colorHex,
        colorName
      };
    });
  }

  res.json({ tweets });
});

app.use('/api', Object.values(middleware), router);
app.listen(SERVER_PORT);

console.log(`App listening on ${SERVER_PORT}`);
