import { EJSON } from 'bson';

export type ConfigRoute = {
  name: string,
  method: string,
  path: string,
  handler: string,
  component: string,
  byName?: { [route: string]: EJSON.SerializableTypes},
  byPath?: { [route: string]: EJSON.SerializableTypes},
  raw?: EJSON.SerializableTypes[]
};

export type RequestRoute = {
  byName: { [route: string]: EJSON.SerializableTypes},
  byPath: { [route: string]: EJSON.SerializableTypes},
  raw: EJSON.SerializableTypes[]
};

export type LastSavedTweet = {
  id: string,
  created_at: string
};

export type TwitterParams = {
  screen_name: string;
  count: number;
  since_id?: string,
  max_id?: string
};

export type GetTweets = (
  arg1: string,
  arg2: TwitterParams
) => Promise<any>;

export type Tweet = {
  id: number,
  created_at: EJSON.SerializableTypes,
  text: string,
  colorHex: string,
  colorName: string
};

export type TweetsByDay = {
  tweetsByDay: Tweet[] | [],
  day: EJSON.SerializableTypes
};

export type Tweets = TweetsByDay[];
