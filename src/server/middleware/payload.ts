import { Request, Response, NextFunction } from 'express';

export default (request: Request, response: Response, next: NextFunction): void => {
  request.payload = { data: new Map(), meta: new Map() };

  next();
};
