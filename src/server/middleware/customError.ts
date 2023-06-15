/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';

import { HttpException } from '../httpException';

export default (
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  response.status(error.status).end(error.message);
};
