import HTTPStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';

export default (request: Request, response: Response, next: NextFunction): void => {
  if (request.url === '/health/') {
    response.status(HTTPStatus.OK).end('Healthy!');
  } else {
    next();
  }
};
