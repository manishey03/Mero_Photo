import UserModel from '../modules/user/model/user.model';
import AuthMiddleware from './auth.middleware';
import RoleMiddleware from './role.middleware';

const auth = new AuthMiddleware().auth;
const roleMiddleware = new RoleMiddleware(UserModel);

//
export { auth, roleMiddleware };
