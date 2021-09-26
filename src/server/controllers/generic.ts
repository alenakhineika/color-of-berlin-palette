import HTTPStatus from 'http-status';
import { MongoClient, Db, Collection } from 'mongodb';
import React from 'react';
import { renderToString  } from 'react-dom/server';
import { Request, Response, NextFunction } from 'express';

import App from '../../client/components/app';
import { HttpException } from '../httpException';
import { Tweets } from '../../shared/types/types';

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
      { $match: { colorHex: { $ne: null } } },
      {
        $addFields: {
          day: { $toDate: '$created_at' },
          tweetsByDay: [{ id: '$id', created_at: '$day', colorHex: '$colorHex' }]
        }
      },
      { $sort: { day: -1 } },
      { $limit: 28 },
      { $project: { tweetsByDay: 1, day: 1, _id: 0 } }
    ]).toArray();

    response.json({ tweets });
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
      { $match: { colorHex: { $ne: null } } },
      { $sort: { day: -1 } },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: '$day' },
            month: { $month: '$day' },
            year: { $year: '$day' }
          },
          tweetsByDay: { $push: { id: '$id', created_at: '$day', colorHex: '$colorHex' } }
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

    response.json({ tweets });
  } catch (error) {
    next(new HttpException({
      status: HTTPStatus.INTERNAL_SERVER_ERROR,
      message: error.message
    }));
  }
};

exports.getAllColors = async (
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
      { $sort: { day: -1 } },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: '$day' },
            month: { $month: '$day' },
            year: { $year: '$day' }
          },
          tweetsByDay: { $push: { id: '$id', created_at: '$day', colorHex: '$colorHex' } }
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
      { $project: { _id: 0, day: 1, tweetsByDay: 1 }}
    ]).toArray();

    response.json({ tweets });
  } catch (error) {
    next(new HttpException({
      status: HTTPStatus.INTERNAL_SERVER_ERROR,
      message: error.message
    }));
  }
};
