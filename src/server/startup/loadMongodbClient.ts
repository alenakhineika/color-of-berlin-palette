import { Express } from 'express';
import { MongoClient } from 'mongodb';

export default async (app: Express): Promise<void> => {
  const client: MongoClient = new MongoClient(
    app.get('config').server.mongodbUri,
  );
  app.set('service.mongodbClient', () => client);
};
