import { Express, Request, Response, NextFunction } from 'express';

import { ConfigRoute } from '../../shared/types/types';
import { HTTPMethod } from '../../shared/types/enums';

export default (app: Express): void => {
  app.set('routes.path', new Map());
  app.get('config').routes.forEach((route: ConfigRoute) => {
    const method: HTTPMethod = route.method.toLowerCase() as HTTPMethod;

    app[method](
      route.path,
      (request: Request, response: Response, next: NextFunction) => {
        next();
      },
    );
    app.get('routes.path').set(route.path, route);
  });
};
