import { Request, Response, NextFunction } from 'express';

//
import { jwtHelper } from '../utils/jwt.helper';
import { NotAuthorizedError } from '../utils/api/apiError';

//
import { userService } from '../modules/user';

class AuthMiddleware {
  constructor() {
    this.auth = this.auth.bind(this);
  }

  async auth(req: Request, _res: Response, next: NextFunction) {
    try {
      const accessToken = this.getTokenFromHeader(req);
      if (!accessToken) {
        throw new NotAuthorizedError('Invalid token');
      }

      const payload = jwtHelper.verifyAccessToken(accessToken);
      const user = await userService.getUserByEmail(payload.email);
      req.user = user;
      req.payload = payload;

      next();
    } catch (err) {
      next(err);
    }
  }

  private getTokenFromHeader(req: Request): string | null {
    const cookie = req.cookies.token;
    if (cookie) return cookie;
    const authorizationHeader = req.headers['authorization'];
    if (authorizationHeader && typeof authorizationHeader === 'string') {
      const [scheme, token] = authorizationHeader.split(' ');
      if (scheme === 'Bearer' && token) {
        return token;
      }
    }
    return null;
  }
}

export default AuthMiddleware;
