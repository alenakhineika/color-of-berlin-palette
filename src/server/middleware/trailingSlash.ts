import HTTPStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';

export default (request: Request, response: Response, next: NextFunction): void => {
  if (request.path[request.path.length - 1] !== '/') {
    response.status(HTTPStatus.MOVED_PERMANENTLY).redirect(`${request.path}/`);
  } else {
    next();
  }
};
