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

const HOSTNAME = process.env.HOSTNAME || 'localhost';
const PORT = process.env.PORT || '3000';
const URI = `http://${HOSTNAME}:${PORT}`;

const apiRoute: Api = new Api(URI);

export default apiRoute;
