import { HttpException } from '@nestjs/common';

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,

  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  NOT_MODIFIED = 304,

  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  PRECONDITION_FAILED = 412,
  PRECONDITION_REQUIRED = 428,

  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

export const HttpStatusMessages = {
  // 200 OK
  USER_CREATED: {
    statusCode: 200001,
    message: 'User created successfully.',
  },
  // 404 Not Found
  USER_NOT_FOUND: {
    statusCode: 404001,
    message: 'User not found.',
  },
  // 409 Conflict
  USER_ALREADY_EXISTS: {
    statusCode: 409001,
    message: 'User already exists.',
  },
};

/**
 * Returns either a formatted response object or throws an HttpException.
 * @param key The key from HttpStatusMessages
 * @param isException If true, throws an exception; otherwise, returns a response object
 * @param data Optional data to include in the response
 */
export function customHttpStatus(
  key: keyof typeof HttpStatusMessages,
  isException = false,
  data?: unknown,
) {
  const { message, statusCode } = HttpStatusMessages[key];
  if (isException) {
    throw new HttpException({ message, statusCode }, statusCode);
  }
  const result: { statusCode: number; message: string; data?: unknown } = {
    statusCode,
    message,
  };
  if (data !== undefined) {
    result.data = data;
  }
  return result;
}
