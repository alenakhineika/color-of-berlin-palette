import { MongoClient, Db, Collection } from 'mongodb';
import React from 'react';
import { renderToString  } from 'react-dom/server';
import { Request, Response, NextFunction } from 'express';

import App from '../../client/app';
import { Tweet, TweetsByDay, Tweets } from '../../shared/types/types';

const getColorsFromText = (tweets: Tweets): Tweets => {
  return tweets.map((item: TweetsByDay) => {
    const tweetsByDay: Tweet[] = [];

    item.tweetsByDay.forEach((tweet: Tweet) => {
      const textAll = tweet.text.split('. #');
      const colorHex = `#${textAll[1].substring(0, 6)}`;
      const textWithColorName = textAll[0].split('The color of the sky in Berlin is ');
      const colorName = textWithColorName[1];
  
      tweetsByDay.push({
        id: tweet.id,
        created_at: tweet.created_at,
        text: tweet.text,
        colorHex,
        colorName
      });
    });

    item.tweetsByDay = tweetsByDay;

    return item;
  });
};

exports.index = async (request: Request, response: Response): Promise<void> => {
  const html = ({ body }: { body: string }) => `
    <!DOCTYPE html>
    <html>
      <head>
        <link href="main.css" rel="stylesheet">
      </head>
      <body>
        <div id="root">${body}</div>
      </body>
      <script src="main.bundle.js" defer></script>
    </html>
  `;

  const body = renderToString(React.createElement(App));

  response.send(html({ body }));
};

exports.getRecentTweets = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  const { mongodbDatabase, mongodbCollection } = request.app.get('config').server;
  const mongoClient: MongoClient = request.app.get('service.mongodbClient')();
   // Access the `colorofberlin` database.
  const database: Db | undefined = mongoClient.db(mongodbDatabase);
  // Access the `tweets` collection.
  const collection: Collection | undefined = database.collection(mongodbCollection);
  // The data format expected by the client.
  let tweets: Tweets = [];

  if (!collection) {
    response.json({ tweets });

    return;
  }

  try {
    // Use aggregation to find 28 recent tweets
    // and modify the resulting array to match the expected data format.
    tweets = await collection.aggregate([
      // Take the created_at field that has a string value and can't be sorted
      // and create a new convertedDate field that has a ISODate value.
      { $addFields: {
        day: { $toDate: '$created_at' },
        tweetsByDay: [{ id: '$id', created_at: '$day', text: '$text' }] }
      },
      // Sort descending from the most recent tweet to later ones.
      { $sort: { day: -1 } },
      // Return only 28 recent tweets, not all the tweets that exist in the collection.
      { $limit: 28 },
      // Return only id, created_at and text, not all the fields that a document has.
      { $project: { tweetsByDay: 1, day: 1, _id: 0 } }
    ]).toArray();

    // A color's hex value and a name are stored inside a text string.
    // Parse the string to extract these values.
    tweets = getColorsFromText(tweets);

    response.json({ tweets });
  } catch (error) {
    next(new Error(error));
  }
};

exports.getLastWeekTweets = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  const { mongodbDatabase, mongodbCollection } = request.app.get('config').server;
  const mongoClient: MongoClient = request.app.get('service.mongodbClient')();
   // Access the `colorofberlin` database.
  const database: Db | undefined = mongoClient.db(mongodbDatabase);
  // Access the `tweets` collection.
  const collection: Collection | undefined = database.collection(mongodbCollection);
  // The data format expected by the client.
  let tweets: Tweets = [];

  if (!collection) {
    response.json({ tweets });

    return;
  }

  try {
    // Use aggregation to find 28 recent tweets
    // and modify the resulting array to match the expected data format.
    tweets = await collection.aggregate([
      { $addFields: { day: { $toDate: '$created_at' } } },
      { $sort: { day: -1 } },
      { $group: {
        _id: {
          day: { $dayOfMonth: '$day' }, 
          month: { $month: '$day' }, 
          year: { $year: '$day' } }, 
          tweetsByDay: { $push: { id: '$id', created_at: '$day', text: '$text' } }
        }
      },
      { $addFields: {
          day: {
            $dateFromParts: {
              year: '$_id.year', 
              month: '$_id.month', 
              day: '$_id.day'
            }
          }
        }
      },
      { $sort: { day: -1 } },
      { $limit: 7 },
      { $project: { _id: 0, day: 1, tweetsByDay: 1 }}
    ]).toArray();

    tweets = getColorsFromText(tweets);

    response.json({ tweets });
  } catch (error) {
    next(new Error(error));
  }
};
