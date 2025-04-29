import * as argon2 from 'argon2';

//
import { CustomError } from '../utils/api/apiError';

const hashPassword = async (value: string): Promise<string> => {
  try {
    const hash = await argon2.hash(value);
    return hash.toString();
  } catch (error) {
    throw new CustomError(`Unable to process ${error}`, 400);
  }
};

const verifyPassword = async (hash: string, value: string): Promise<boolean> => {
  try {
    const verify = await argon2.verify(hash, value);
    return verify;
  } catch (error) {
    throw new CustomError(`Unable to process ${error}`, 400);
  }
};

export { hashPassword, verifyPassword };
