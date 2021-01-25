import config from './config';

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

const apiRoute: Api = new Api(`http://${config.client.hostname}:${config.client.port}`);

export default apiRoute;
