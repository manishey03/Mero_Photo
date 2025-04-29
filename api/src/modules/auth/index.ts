import AuthService from './auth.service';
import AuthController from './auth.controller';

//
import { userService } from '../user/index';

//
const authService = new AuthService(userService);
const authController = new AuthController();

export { authService, authController };
