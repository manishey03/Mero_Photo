import { Request, Response, NextFunction } from 'express';

//
import ApiResponse from '../../utils/api/apiResponse';

//
import { userService } from './index';
import { IGetUserSchemaType } from './user.validation';
import { IUser } from './type';
import { IParamIdSchema } from '../../utils/validator';

/**
 * User Controller
 */
class UserController {
  async getUserByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await userService.getUserByEmail(req.body);

      //
      return new ApiResponse(res).addMessage('Fetched user details').send(response);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get Photographer Details
   */
  async getPhotographerDetails(req: Request<IParamIdSchema>, res: Response, next: NextFunction) {
    try {
      const data = await userService.getPhotographerDetails(req.params.id);

      //
      return new ApiResponse(res).addMessage('Photographer fetched successfully').send(data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get Notification
   */
  async getNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, count } = await userService.getNotifications(req.user as IUser);

      //
      return new ApiResponse(res)
        .addMessage('Fetched user notification successfully')
        .addMetadata({ count })
        .send(data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Upload Profile
   */
  async uploadProfile(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.uploadProfile(String(req.user._id), req.body);

      //
      return new ApiResponse(res).addMessage('Image uploaded successfully').send({});
    } catch (err) {
      next(err);
    }
  }

  /**
   * Upload Image
   */
  async uploadFeatureImage(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.uploadFeatureImage(String(req.user._id), req.body);

      //
      return new ApiResponse(res).addMessage('Image uploaded successfully').send({});
    } catch (err) {
      next(err);
    }
  }

  async deleteFeatureImage(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.deleteFeatureImage(req.params.id);

      //
      return new ApiResponse(res).addMessage('Image deleted successfully').send({});
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get Users
   */
  async getUsers(req: Request<IGetUserSchemaType>, res: Response, next: NextFunction) {
    try {
      const { data, count } = await userService.getUsers(req.params.role);

      //
      return new ApiResponse(res).addMessage('Fetched users successfully').addMetadata({ count }).send(data);
    } catch (err) {
      next(err);
    }
  }

  async adminDashboard(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await userService.adminDashboard();

      //
      return new ApiResponse(res).addMessage('Admin dashboard successfully').send(data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Photographer Dashboard
   */
  async photographerDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(String(req?.user?._id));
      const data = await userService.photographerDashboard(String(req.user._id));

      //
      return new ApiResponse(res).addMessage('Photographer dashboard successfully').send(data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Package
   */
  async getPackage(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, count } = await userService.getPackage(String(req.user._id));

      //
      return new ApiResponse(res)
        .addMessage('Package fetched successfully')
        .addMetadata({
          count,
        })
        .send(data);
    } catch (err) {
      next(err);
    }
  }

  async createPackage(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await userService.createPackage(String(req.user._id), req.body);

      //
      return new ApiResponse(res).addMessage('Package created successfully').send(data);
    } catch (err) {
      next(err);
    }
  }

  async updatePackage(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.updatePackage(req.params.id, req.body);

      //
      return new ApiResponse(res).addMessage('Package updated successfully').send({});
    } catch (err) {
      next(err);
    }
  }

  async deletePackage(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.deletePackage(String(req.params.id));

      //
      return new ApiResponse(res).addMessage('Package deleted successfully').send({});
    } catch (err) {
      next(err);
    }
  }

  async deactivateUser(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.deactivateUser(String(req.params.id));

      //
      return new ApiResponse(res).addMessage('User deactivate successfully').send({});
    } catch (err) {
      next(err);
    }
  }

  async activateUser(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.activateUser(String(req.params.id));

      //
      return new ApiResponse(res).addMessage('User activate successfully').send({});
    } catch (err) {
      next(err);
    }
  }
}

export default UserController;
