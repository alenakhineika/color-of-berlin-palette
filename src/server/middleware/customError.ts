import { Request, Response, NextFunction } from 'express';

import { HttpException } from '../httpException';

export default (error: HttpException, request: Request, response: Response, next: NextFunction) => {
  response.status(error.status).end(error.message);
};
