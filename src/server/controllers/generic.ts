import HTTPStatus from 'http-status';
import { MongoClient, Db, Collection } from 'mongodb';
import React from 'react';
import { renderToString  } from 'react-dom/server';
import { Request, Response, NextFunction } from 'express';

import App from '../../client/components/app';
import { HttpException } from '../httpException';
import { Tweet, TweetsByDay, Tweets } from '../../shared/types/types';

const HEX_COLOR_REGEX = /(#[a-zA-Z0-9]{6})/;

export const getColorsFromText = (tweets: Tweets): Tweets => {
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
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
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

exports.getThirtyTweetsColors = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response> => {
  const { mongodbDatabase, mongodbCollection } = request.app.get('config').server;
  const mongoClient: MongoClient = request.app.get('service.mongodbClient')();
   // Access the `colorofberlin` database.
  const database: Db | undefined = mongoClient.db(mongodbDatabase);
  // Access the `tweets` collection.
  const collection: Collection | undefined = database.collection(mongodbCollection);
  // The data format expected by the client.
  let tweets: Tweets = [];

  if (!collection) {
    return response.json({ tweets });
  }

  try {
    tweets = await collection.aggregate([
      {
        $addFields: {
          day: { $toDate: '$created_at' },
          tweetsByDay: [{ id: '$id', created_at: '$day', text: '$text' }]
        }
      },
      { $match: { text: { $regex: HEX_COLOR_REGEX } } },
      { $sort: { day: -1 } },
      { $limit: 28 },
      { $project: { tweetsByDay: 1, day: 1, _id: 0 } }
    ]).toArray();

    // A color's hex value and a name are stored inside a text string.
    // Parse the string to extract these values.
    const parsedTweets = getColorsFromText(tweets);

    response.json({ tweets: parsedTweets });
  } catch (error) {
    next(new HttpException({
      status: HTTPStatus.INTERNAL_SERVER_ERROR,
      message: error.message
    }));
  }
};

exports.getSevenDaysColors = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response> => {
  const { mongodbDatabase, mongodbCollection } = request.app.get('config').server;
  const mongoClient: MongoClient = request.app.get('service.mongodbClient')();
  const database: Db | undefined = mongoClient.db(mongodbDatabase);
  const collection: Collection | undefined = database.collection(mongodbCollection);
  let tweets: Tweets = [];

  if (!collection) {
    return response.json({ tweets });
  }

  try {
    tweets = await collection.aggregate([
      { $addFields: { day: { $toDate: '$created_at' } } },
      { $match: { text: { $regex: HEX_COLOR_REGEX } } },
      { $sort: { day: -1 } },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: '$day' },
            month: { $month: '$day' },
            year: { $year: '$day' }
          },
          tweetsByDay: { $push: { id: '$id', created_at: '$day', text: '$text' } }
        }
      },
      {
        $addFields: {
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
    next(new HttpException({
      status: HTTPStatus.INTERNAL_SERVER_ERROR,
      message: error.message
    }));
  }
};
