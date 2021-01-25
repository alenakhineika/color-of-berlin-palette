import { Request, Response, NextFunction } from 'express';

export default (request: Request, response: Response, next: NextFunction): void => {
  if (request && request.payload) {
    request.payload.routeInfo = request.app
      .get('routes.path')
      .get(request.route.path);
    request.payload.routeQuery = request.query;
  }

  next();
};
