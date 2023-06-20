import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';

import middleware from './middleware';
import startup from './startup';

const app = express();

// Load project settings.
startup.loadConfig(app);
startup.loadSettings(app);
startup.loadRoutes(app);

// Apply before middleware.
app.use(helmet());

app.use(cookieParser());
app.use(compression());

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '300mb' })); // To parse the incoming requests with JSON payloads.

app.use(middleware.logger);
app.use(middleware.payload);
app.use(express.static(__dirname + '/public'));
app.use(middleware.topology);

// Instantiate the MongoDB client.
startup.loadMongodbClient(app);

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
