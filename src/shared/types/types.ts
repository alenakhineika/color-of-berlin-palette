import { EJSON } from 'bson';

export type ConfigRoute = {
  name: string;
  method: string;
  path: string;
  handler: string;
  component: string;
  byName?: { [route: string]: EJSON.SerializableTypes};
  byPath?: { [route: string]: EJSON.SerializableTypes};
  raw?: EJSON.SerializableTypes[];
};

export type RequestRoute = {
  byName: { [route: string]: EJSON.SerializableTypes};
  byPath: { [route: string]: EJSON.SerializableTypes};
  raw: EJSON.SerializableTypes[];
};

export type LastSavedRecord = {
  id: string;
  created_at: string;
};

export type TwitterParams = {
  screen_name: string;
  count: number;
  since_id?: string;
  max_id?: string;
};

export type GetRecords = (
  arg1: string,
  arg2: TwitterParams
) => Promise<any>;

export type Record = {
  id: number;
  text: string;
  created_at?: EJSON.SerializableTypes;
  colorHex?: string;
  colorName?: string;
};

export type RecordsByDay = {
  recordsByDay: Record[];
  day: EJSON.SerializableTypes;
};

export type RecordsLeaderboard = {
  value: number;
  color: string;
};

export type Records = Record[] | RecordsByDay[] | RecordsLeaderboard[];
