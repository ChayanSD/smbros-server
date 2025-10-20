import { Request, Response, NextFunction } from 'express';
import { registrationSchema } from '../../schemas/auth/registration.schema';
import { registerUser } from '../../services/auth/registration.service';
import { ResponseHandler } from '../../utils/responseHandler';

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = registrationSchema.parse(req.body);
    const user = await registerUser(parsed);
    ResponseHandler.created(res, user, 'Registration completed successfully');
  } catch (err) {
    next(err);
  }
};
