export type TypeResponse = {
  statusCode: number;
  [data: string]: {}
};

export type TypeResponseError = {
  statusCode: number;
  error: string;
  message: string;
};
