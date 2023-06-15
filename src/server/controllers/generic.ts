import HTTPStatus from 'http-status';
import { MongoClient, Db, Collection } from 'mongodb';
import type { Document } from 'mongodb';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Request, Response, NextFunction } from 'express';

import App from '../../client/components/app';
import { HttpException } from '../httpException';

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

exports.getRecentRecords = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<Response> => {
  const { mongodbDatabase, mongodbCollection, cameraLocation } =
    request.app.get('config').server;
  const mongoClient: MongoClient = request.app.get('service.mongodbClient')();
  // Access the `colorofberlin` database.
  const database: Db | undefined = mongoClient.db(mongodbDatabase);
  // Access the `records` collection.
  const collection: Collection | undefined =
    database.collection(mongodbCollection);
  // The data format expected by the client.
  let records: Document[] = [];

  if (!collection) {
    return response.json({ records });
  }

  try {
    records = await collection
      .aggregate([
        { $match: { colorHex: { $ne: null } } },
        {
          $match: {
            $or: [
              { location: { $exists: false } },
              { location: cameraLocation },
            ],
          },
        },
        { $addFields: { day: { $toDate: '$created_at' } } },
        { $sort: { day: -1 } },
        { $limit: 28 },
        { $project: { _id: 0, created_at: '$day', colorHex: '$colorHex' } },
      ])
      .toArray();

    response.json({ records });
  } catch (error) {
    next(
      new HttpException({
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      }),
    );
  }
};

exports.getRecentRecordsPerWeek = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<Response> => {
  const { mongodbDatabase, mongodbCollection, cameraLocation } =
    request.app.get('config').server;
  const mongoClient: MongoClient = request.app.get('service.mongodbClient')();
  const database: Db | undefined = mongoClient.db(mongodbDatabase);
  const collection: Collection | undefined =
    database.collection(mongodbCollection);
  let records: Document[] = [];

  if (!collection) {
    return response.json({ records });
  }

  try {
    records = await collection
      .aggregate([
        { $addFields: { day: { $toDate: '$created_at' } } },
        { $match: { colorHex: { $ne: null } } },
        {
          $match: {
            $or: [
              { location: { $exists: false } },
              { location: cameraLocation },
            ],
          },
        },
        { $sort: { day: -1 } },
        {
          $group: {
            _id: {
              day: { $dayOfMonth: '$day' },
              month: { $month: '$day' },
              year: { $year: '$day' },
            },
            recordsByDay: {
              $push: { id: '$id', created_at: '$day', colorHex: '$colorHex' },
            },
          },
        },
        {
          $addFields: {
            day: {
              $dateFromParts: {
                year: '$_id.year',
                month: '$_id.month',
                day: '$_id.day',
              },
            },
          },
        },
        { $sort: { day: -1 } },
        { $limit: 7 },
        { $project: { _id: 0, recordsByDay: 1 } },
      ])
      .toArray();

    response.json({ records });
  } catch (error) {
    next(
      new HttpException({
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      }),
    );
  }
};

/* Set to 365 days */
exports.getAllData = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<Response> => {
  const { mongodbDatabase, mongodbCollection, cameraLocation } =
    request.app.get('config').server;
  const mongoClient: MongoClient = request.app.get('service.mongodbClient')();
  const database: Db | undefined = mongoClient.db(mongodbDatabase);
  const collection: Collection | undefined =
    database.collection(mongodbCollection);
  let records: Document[] = [];

  if (!collection) {
    return response.json({ records });
  }

  try {
    records = await collection
      .aggregate([
        {
          $match: {
            $or: [
              { location: { $exists: false } },
              { location: cameraLocation },
            ],
          },
        },
        { $addFields: { day: { $toDate: '$created_at' } } },
        {
          $match: {
            $expr: {
              $gt: [
                '$created_at',
                {
                  $dateSubtract: {
                    startDate: '$$NOW',
                    unit: 'day',
                    amount: 365,
                  },
                },
              ],
            },
          },
        },
        { $sort: { day: -1 } },
        {
          $group: {
            _id: {
              day: { $dayOfMonth: '$day' },
              month: { $month: '$day' },
              year: { $year: '$day' },
            },
            recordsByDay: {
              $push: {
                id: '$id',
                created_at: '$day',
                colorHex: { $trim: { input: '$colorHex', chars: '#' } },
              },
            },
          },
        },
        {
          $addFields: {
            day: {
              $dateFromParts: {
                year: '$_id.year',
                month: '$_id.month',
                day: '$_id.day',
              },
            },
          },
        },
        { $sort: { day: 1 } },
        { $project: { _id: 0, day: 1, recordsByDay: 1 } },
      ])
      .toArray();

    response.json({ records });
  } catch (error) {
    next(
      new HttpException({
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      }),
    );
  }
};

exports.getLeaderboard = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<Response> => {
  const { mongodbDatabase, mongodbCollection, cameraLocation } =
    request.app.get('config').server;
  const mongoClient: MongoClient = request.app.get('service.mongodbClient')();
  const database: Db | undefined = mongoClient.db(mongodbDatabase);
  const collection: Collection | undefined =
    database.collection(mongodbCollection);
  let records: Document[] = [];

  if (!collection) {
    return response.json({ records });
  }

  try {
    records = await collection
      .aggregate([
        {
          $match: {
            $or: [
              { location: { $exists: false } },
              { location: cameraLocation },
            ],
          },
        },
        {
          $group: {
            _id: '$colorHex',
            recordsByColor: {
              $push: { id: { $trim: { input: '$id', chars: '#' } } },
            },
            value: { $sum: 1 },
          },
        },
        { $addFields: { color: { $concat: ['#', '$_id'] } } },
        { $sort: { value: -1 } },
        { $limit: 25 },
        { $project: { _id: 0, value: 1, color: 1, label: '$color' } },
      ])
      .toArray();

    response.json({ records });
  } catch (error) {
    next(
      new HttpException({
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      }),
    );
  }
};
