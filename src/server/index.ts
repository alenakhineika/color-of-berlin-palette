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
app.use(middleware.topology);

// Instantiate the MongoDB client.
startup.loadMongodbClient(app);

// Map routes to controllers.
startup.loadControllers(app);

// Use custom error handler as after middleware.
app.use(middleware.customError);

// Start the server.
const serverPort = Number(process.env.PORT) || app.get('config').server.port;
const serverHostname =
  Number(process.env.HOSTNAME) || app.get('config').server.hostname;
const url = `http://${serverHostname}:${serverPort}`;

app.listen(serverPort, () => {
  console.log(`Your server available at ${url}`);
});
