import { Request, Response, NextFunction } from 'express';

interface IReqs { date: string, method: string, url: string, body: unknown }

const reqs: IReqs[] = [];

export default (req: Request, res: Response, next: NextFunction): void => {
  console.clear();

  const date: Date = new Date();

  reqs.push({
    date: `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`,
    method: req.method,
    url: `${req.baseUrl}${req.url}`,
    body: req.body
  });

  const len: number = reqs.length;

  console.table(reqs.length > 10 ? reqs.slice(len - 10, len).reverse() : reqs.reverse());
  next();
};
