import { Express } from 'express';

import config from '../config';

export default (app: Express): void => {
  app.set('config', config);
};
