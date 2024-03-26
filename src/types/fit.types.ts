export type DecodedFitFile = {
  [key: string]: Array<Record<any, any>>;
};

export type MongoInsertable = DecodedFitFile;
