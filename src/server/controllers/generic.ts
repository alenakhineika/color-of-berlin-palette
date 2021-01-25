import { MongoClient, Db, Collection } from 'mongodb';
import { Request, Response, NextFunction } from 'express';

exports.index = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  const { mongodbDatabase, mongodbCollection } = request.app.get('config').server;
  const mongoClient: MongoClient = request.app.get('service.mongodbClient')();
   // Access the `colorofberlin` database.
  const database: Db | undefined = mongoClient.db(mongodbDatabase);
  // Access the `tweets` collection.
  const collection: Collection | undefined = database.collection(mongodbCollection);
  // The data format expected by the client.
  let tweets: {
    id: number,
    created_at: string,
    text: string,
    colorHex: string,
    colorName: string
  }[] | [] = [];

  if (!collection) {
    response.json({ tweets });

    return;
  }

  try {
    // Use aggregation to find 30 recent tweets
    // and modify the resulting array to match the expected data format.
    tweets = await collection.aggregate([
      // Take the created_at field that has a string value and can't be sorted
      // and create a new convertedDate field that has a ISODate value.
      { $addFields: { convertedDate: { $toDate: '$created_at' } } },
      // Sort descending from the most recent tweet to later ones.
      { $sort: { convertedDate: -1 } },
      // Return only 30 recent tweets, not all the tweets that exist in the collection.
      { $limit: 30 },
      // Return only id, created_at and text, not all the fields that a document has.
      { $project: { _id: 0, id: 1, created_at: 1, text: 1 } }
    ]).toArray();

    // A color's hex value and a name are stored inside a text string.
    // Parse the string to extract these values.
    tweets = tweets.map((item) => {
      const textAll = item.text.split('. #');
      const colorHex = `#${textAll[1].substring(0, 6)}`;
      const textWithColorName = textAll[0].split('The color of the sky in Berlin is ');
      const colorName = textWithColorName[1];

      return {
        id: item.id,
        created_at: item.created_at,
        text: item.text,
        colorHex,
        colorName
      };
    });

    response.json({ tweets });
  } catch (error) {
    next(new Error(error));
  }
};

