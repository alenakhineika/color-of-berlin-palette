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

const client: MongoClient = new MongoClient(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let database: Db | undefined;
let collection: Collection | undefined;

(async () => {
  try {
    await client.connect();
    database = client.db(MONGODB_DATABASE);
    collection = database.collection(MONGODB_COLLECTION);
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

router.get('/getTweets', async (req: Request, res: Response) => {
  let tweets: {
    id: number,
    created_at: string,
    text: string,
    colorHex: string,
    colorName: string
  }[] | [] = [];

  if (collection) {
    tweets = await collection.aggregate([
      { $addFields: { convertedDate: { $toDate: '$created_at' } } },
      { $sort: { convertedDate: -1 } },
      { $limit: 30 },
      { $project: { _id: 0, id: 1, created_at: 1, text: 1 } }
    ]).toArray();

    tweets = tweets.map((item) => {
      const textAll = item.text.split('. #');
      const colorHex = textAll[1].substring(0, 6);
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
