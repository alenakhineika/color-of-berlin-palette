import HTTPStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';
import { MongoClient } from 'mongodb';

import { HttpException } from '../httpException';

let isConnected = false;

export default async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  const mongoClient: MongoClient = request.app.get('service.mongodbClient')();

  mongoClient.on('open', () => {
    isConnected = true;
  })

  mongoClient.on('optopologyCloseden', () => {
    isConnected = false;
  })

  if (!isConnected) {
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
