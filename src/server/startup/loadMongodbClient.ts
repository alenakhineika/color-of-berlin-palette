import { Express } from 'express';
import { MongoClient } from 'mongodb';

export default async (app: Express): Promise<void> => {
  const client: MongoClient = new MongoClient(app.get('config').server.mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
  } catch (error) {
    console.error(`Connect to MongoDB failed: ${error.message}`);
  }

  app.set('service.mongodbClient', () => client);
};
