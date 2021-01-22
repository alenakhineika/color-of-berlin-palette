const CLIENT_HOST = 'http://localhost:3000';

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
    return `${this.host}/api/${routeName}`;
  }
}

const apiRoute: Api = new Api(CLIENT_HOST);

export default apiRoute;
