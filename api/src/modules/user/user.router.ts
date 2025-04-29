import express from 'express';

//
import { userController } from './index';

//
import { auth, roleMiddleware } from '../../middleware';
import { bodyValidator, paramsValidator } from '../../middleware/validator.middleware';
import { createPackage, getUserSchema } from './user.validation';
import Upload from '../../utils/fileUpload';
import { fileParseRequestMiddleware } from './middleware/mediaRequest';

//

//
const userRouter = express.Router();

userRouter
  .route('/upload-profile')
  .post(auth, Upload.array('file'), fileParseRequestMiddleware, userController.uploadProfile);

userRouter.route('/deactivate/:id').patch(auth, roleMiddleware.checkAdmin, userController.deactivateUser);

userRouter.route('/activate/:id').patch(auth, roleMiddleware.checkAdmin, userController.activateUser);

//
userRouter
  .route('/upload-feature-images')
  .post(
    auth,
    roleMiddleware.checkPhotographer,
    Upload.array('file'),
    fileParseRequestMiddleware,
    userController.uploadFeatureImage,
  );

userRouter.route('/image/:id').delete(auth, roleMiddleware.checkPhotographer, userController.deleteFeatureImage);

userRouter.route('/package').get(auth, roleMiddleware.checkPhotographer, userController.getPackage);

userRouter
  .route('/package')
  .post(auth, roleMiddleware.checkPhotographer, bodyValidator(createPackage), userController.createPackage);
userRouter.route('/package/:id').patch(auth, roleMiddleware.checkPhotographer, userController.updatePackage);

userRouter.route('/package/:id').delete(auth, roleMiddleware.checkPhotographer, userController.deletePackage);

userRouter.route('/notification').get(auth, userController.getNotification);
userRouter.route('/photographer/:id').get(auth, userController.getPhotographerDetails);
userRouter.route('/dashboard/admin').get(auth, roleMiddleware.checkAdmin, userController.adminDashboard);
userRouter
  .route('/dashboard/photographer')
  .get(auth, roleMiddleware.checkPhotographer, userController.photographerDashboard);

userRouter.route('/:role').get(paramsValidator(getUserSchema), userController.getUsers);

//
export default userRouter;
