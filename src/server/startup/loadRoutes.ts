import { Express } from 'express';

const genericRouter = require('../routes/generic');

export default (app: Express): void => {
  app.use('/', genericRouter);
};
