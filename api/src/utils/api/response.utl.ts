import { ValidationError } from 'yup';

const success = (message: string, result: unknown, statusCode: number) => {
  return {
    message,
    result,
    code: statusCode,
  };
};

const validation = (errors: ValidationError) => {
  const error: string[] = [];
  errors.errors.map((item: string) => {
    error.push(item);
  });
  return {
    message: 'Validation error',
    code: 422,
    error,
  };
};

const error = (err: Error, statusCode: number) => {
  const codes = [400, 401, 403, 404, 406, 422, 500];

  if (!codes.includes(statusCode)) statusCode = 500;

  const anyMessage =
    err.message ?? 'There is issue in backend server. If the error persists, kindly contact the backend developer.';

  const message = typeof err === 'string' ? err : anyMessage;

  return {
    message,
    code: statusCode,
  };
};

export { success, validation, error };
