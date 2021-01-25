import { Express } from 'express';

export default (app: Express): void => {
  app.set('strict routing', true);
  app.set('trust proxy', true);
  app.set('x-powered-by', false);
};
