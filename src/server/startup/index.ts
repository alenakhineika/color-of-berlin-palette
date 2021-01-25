import loadConfig from './loadConfig';
import loadMongodbClient from './loadMongodbClient';
import loadRoutes from './loadRoutes';
import loadSettings from './loadSettings';
import loadStaticFiles from './loadStaticFiles';
import configureRoutes from './configureRoutes';

export default {
  configureRoutes,
  loadConfig,
  loadMongodbClient,
  loadRoutes,
  loadSettings,
  loadStaticFiles
};