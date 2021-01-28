import HTTPStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';
import { MongoClient } from 'mongodb';

import { HttpException } from '../httpException';

const isConnected = (mongoClient: MongoClient): boolean => {
  return (!!mongoClient && mongoClient.isConnected());
};

export default async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  const mongoClient: MongoClient = request.app.get('service.mongodbClient')();

  if (!isConnected(mongoClient)) {
    try {
      await mongoClient.connect();
    } catch (error) {
      console.error(`Connect to MongoDB failed: ${error.message}`);

      const httpException = new HttpException({
        status:  HTTPStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      });

      return next(httpException);
    }
  }

  next();
};
