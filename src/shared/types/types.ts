export type ConfigRoute = {
  name: string;
  method: string;
  path: string;
  handler: string;
  component: string;
  byName?: { [route: string]: any };
  byPath?: { [route: string]: any };
  raw?: any;
};

export type RequestRoute = {
  byName: { [route: string]: any };
  byPath: { [route: string]: any };
  raw: any;
};
