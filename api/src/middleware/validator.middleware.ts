import { Schema, ValidationError } from 'yup';
import { Request, Response, NextFunction } from 'express';

export const bodyValidator = (schema: Schema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await schema.validate(req.body, {
      abortEarly: false,
    });
    req.body = data;
    next();
  } catch (errorObj) {
    if (errorObj instanceof ValidationError) {
      return res.status(422).json({
        success: false,
        message: 'Body validation error!',
        errors: errorObj,
      });
    } else {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const paramsValidator =
  (schema: Schema) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await schema.validate(req.params, { abortEarly: false });
      req.params = data;
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        const errorObj = error.inner.reduce((acc: Record<string, string[]>, curr) => {
          if (curr.path) {
            acc[curr.path] = curr.errors;
          }
          return acc;
        }, {});

        res.status(422).json({
          success: false,
          message: 'Param validation error!',
          errors: errorObj,
        });
      } else {
        next(error);
      }
    }
  };

export const queryValidator =
  (schema: Schema) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await schema.validate(req.query, { abortEarly: false });
      req.query = data;
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        const errorObj = error.inner.reduce((acc: Record<string, string[]>, curr) => {
          if (curr.path) {
            acc[curr.path] = curr.errors;
          }
          return acc;
        }, {});

        res.status(422).json({
          success: false,
          message: 'Query validation error!',
          errors: errorObj,
        });
      } else {
        next(error);
      }
    }
  };
