import { Express } from 'express';

import { ConfigRoute, RequestRoute } from '../../shared/types/types';
import { HTTPMethod } from '../../shared/types/enums';

export default (app: Express): void => {
  const routes: RequestRoute = { byName: {}, byPath: {}, raw: [] };
  const config = app.get('config');

  config.routes.forEach((route: ConfigRoute) => {
    const handler = route.handler.split('/');
    const routePlaceholder = JSON.parse(JSON.stringify(route));
    const method: HTTPMethod = route.method.toLowerCase() as HTTPMethod;

    app[method](
      route.path,
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require(`../controllers/${handler[0]}`)[handler[1]],
    );

    const placeholders = route.path.match(/:\w+/g) || [];

    routePlaceholder.placeholder = placeholders.map((placeholder: string) =>
      placeholder.slice(1),
    );
    routes.raw.push(routePlaceholder);
    routes.byName[route.name] = routePlaceholder;
    routes.byPath[route.path] = routePlaceholder;
  });

  config.routes = { ...config.routes, ...routes };
  app.set('config', config);
};
