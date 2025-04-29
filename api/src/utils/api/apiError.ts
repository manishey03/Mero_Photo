export class CustomError extends Error {
  public code: number;
  constructor(message: string, code: number = 500) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}

class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, 404);
  }
}

class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message, 400);
  }
}

class NotAuthorizedError extends CustomError {
  constructor(message: string) {
    super(message, 401);
  }
}

class ForbiddenError extends CustomError {
  constructor(message: string) {
    super(message, 403);
  }
}

export { NotFoundError, BadRequestError, NotAuthorizedError, ForbiddenError };
