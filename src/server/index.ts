import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { Express } from 'express';

import middleware from './middleware';
import startup from './startup';

const app: Express = express();

// Load project settings.
startup.loadConfig(app);
startup.loadSettings(app);
startup.loadRoutes(app);

// Apply before middleware.
app.use(cookieParser());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '300mb' }));
app.use(middleware.logger);
app.use(middleware.payload);
app.use(middleware.routeInfo);
app.use(express.static(__dirname + '/public'));

// Instantiate the MongoDB client.
startup.loadMongodbClient(app);

// Map routes to controllers.
startup.loadControllers(app);

// Start the server.
const serverPort = Number(process.env.PORT) || app.get('config').server.port;

app.listen(serverPort, () => {
  console.log(`App listening on port ${serverPort}`);
});
