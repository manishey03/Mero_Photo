import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../../../utils/api/apiError';

/**
 * File parse Request Middleware
 */
export const fileParseRequestMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw new NotFoundError('Files not found');
    }

    console.log(req.files, 'check files');

    const parseData = req.files.map((file) => ({
      imageUrl: file.path,
      alt: file.originalname,
    }));

    //
    req.body = parseData;
    next();
  } catch (error) {
    next(error);
  }
};
