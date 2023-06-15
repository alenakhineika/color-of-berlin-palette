declare module '*.png';
declare module '*.jpg';
declare module '*.gif';
declare module '*.less';

declare namespace Express {
  export interface Request {
    payload?: {
      data?: Map<string, string>;
      meta?: Map<string, string>;
      routeInfo?: Application;
      routeQuery?: any;
    };
  }
}
