import serverSettings from '../server/config';

interface IApi {
  host: string;
  getRoute: (routeName: string) => string;
}

class Api implements IApi {
  host: string;

  constructor(host: string) {
    this.host = host;
  }

  getRoute(routeName: string) {
    return `${this.host}/${routeName}`;
  }
}

const { hostname, port } = serverSettings.server;
const apiRoute: Api = new Api(`http://${hostname}:${port}`);

export default apiRoute;
