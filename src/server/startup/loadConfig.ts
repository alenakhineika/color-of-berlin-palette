import { Express } from 'express';

import config from '../config';

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config();
}

export default (app: Express): void => {
  app.set('config', {
    ...config,
    server: {
      hostname: process.env.HOSTNAME || 'localhost',
      port: process.env.PORT || '3000',
      mongodbUri: process.env.MONGODB_ATLAS_CLUSTER_URI || 'mongodb://localhost',
      mongodbDatabase: process.env.MONGODB_DATABASE || 'coloroflocation',
      mongodbCollection: process.env.MONGODB_COLLECTION || 'colors',
      cameraLocation: process.env.LOCATION || 'Berlin',
    }
  });
};
