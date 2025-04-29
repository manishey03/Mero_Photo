import { Request, Response, NextFunction } from 'express';

//
import { authService } from './index';

//
import ApiResponse from '../../utils/api/apiResponse';

//
import type { IRegisterSchemaType } from './auth.validation';
import type { IChangePasswordSchemaType, IUpdateProfileSchemaType } from '../user/user.validation';

/**
 * Auth Controller
 */
class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await authService.login(req.body);
      res.cookie('token', response?.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      //
      return new ApiResponse(res).addMessage('successfully login').send(response);
    } catch (err) {
      next(err);
    }
  }

  async register(req: Request<unknown, unknown, IRegisterSchemaType>, res: Response, next: NextFunction) {
    try {
      const response = await authService.register(req.body);

      //
      return new ApiResponse(res).addMessage('successfully registered').send(response);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request<unknown, unknown, IUpdateProfileSchemaType>, res: Response, next: NextFunction) {
    try {
      await authService.update(req.user, req.body);

      //
      return new ApiResponse(res).addMessage('Profile update successfully').send({});
    } catch (err) {
      next(err);
    }
  }

  /**
   * Change Password
   */
  async changePassword(req: Request<unknown, unknown, IChangePasswordSchemaType>, res: Response, next: NextFunction) {
    try {
      await authService.changePassword(req.user, req.body);

      //
      return new ApiResponse(res).addMessage('Password changed successfully').send({});
    } catch (err) {
      next(err);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.forgotPassword(req.body);

      //
      return new ApiResponse(res).addMessage('Forgot password link send successfully').send({});
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const data = { ...req.query, ...req.body };
      await authService.resetPassword(data);

      //
      return new ApiResponse(res).addMessage('Password reset successfully').send({});
    } catch (err) {
      next(err);
    }
  }

  async createPhotographer(req: Request<unknown, unknown, IRegisterSchemaType>, res: Response, next: NextFunction) {
    try {
      const response = await authService.createPhotographer(req.body);

      //
      return new ApiResponse(res).addMessage('Photographer created successfully').send(response);
    } catch (err) {
      next(err);
    }
  }

  me(req: Request, res: Response, next: NextFunction) {
    try {
      return new ApiResponse(res).addMessage('Get loggedIn user details').send(req.user);
    } catch (err) {
      next(err);
    }
  }
}

//
export default AuthController;
