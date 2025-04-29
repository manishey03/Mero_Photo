import jwt from 'jsonwebtoken';

import { jwtConfig } from '../config/jwt.config';
import { NotAuthorizedError } from './api/apiError';

//
import { IPayload } from '../types/global';
import { IUser } from '../modules/user/type';

interface IJwtHelperClass {
  createJwtToken(payload: IUser): { accessToken: string; refreshToken: string };
  verifyAccessToken(accessToken: string): IUser;
}

class JwtHelperClass implements IJwtHelperClass {
  createJwtToken(payload: IPayload) {
    const accessToken = jwt.sign(payload, jwtConfig.access.secret, {
      expiresIn: jwtConfig.access.expiration,
    });

    const refreshToken = jwt.sign(payload, jwtConfig.access.secret, {
      expiresIn: jwtConfig.access.expiration,
    });

    return { accessToken, refreshToken };
  }

  verifyAccessToken(accessToken: string): IUser {
    try {
      const decodedData = jwt.verify(accessToken, jwtConfig.access.secret) as IUser;
      return decodedData;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new NotAuthorizedError('Access token expired');
      }
      throw new NotAuthorizedError(err as string);
    }
  }
}

export const jwtHelper = new JwtHelperClass();
