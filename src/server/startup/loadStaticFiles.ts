import { Express, Request, Response } from 'express';

export default (app: Express): void => {
  app.get(
    '/',
    (reqest: Request, response: Response) => response.sendFile('/dist/index.html')
  );
};
