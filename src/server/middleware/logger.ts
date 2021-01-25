import { Request, Response, NextFunction } from 'express';

import { IReqs } from '../types/interfaces';

const reqs: IReqs[] = [];

export default (request: Request, response: Response, next: NextFunction): void => {
  console.clear();

  const date: Date = new Date();

  reqs.push({
    date: `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`,
    method: request.method,
    url: `${request.baseUrl}${request.url}`,
    body: request.body
  });

  const len: number = reqs.length;

  console.table(reqs.length > 10 ? reqs.slice(len - 10, len).reverse() : reqs.reverse());
  next();
};
