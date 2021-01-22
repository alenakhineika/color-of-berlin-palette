import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import middleware from './middlewares';

const SERVER_PORT = Number(process.env.PORT) || 8050;
const CLIENT_PUBLIC_HTML = '/dist/index.html';
const CLIENT_OUT_DIR = 'dist';

// Access MongoDB here.

const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(CLIENT_OUT_DIR));

app.get('/', (req, res) => res.sendFile(CLIENT_PUBLIC_HTML));

const router = express.Router();

// Build MongoDB query here.
const whatColorOfBerlinToday = () => {
  console.log('What color is Berlin today?');

  const query = {

  };
};

router.get('/test', (req: Request, res: Response) => {
  res.json({ text: 'Alena' });
});

app.use('/api', Object.values(middleware), router);
app.listen(SERVER_PORT);

console.log(`App listening on ${SERVER_PORT}`);
