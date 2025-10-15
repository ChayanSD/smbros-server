import { Request, Response, NextFunction } from 'express';
import { registrationSchema } from '../schemas/registration.schema';
import { registerUser } from '../services/registration.service';
import { ResponseHandler } from '../utils/responseHandler';

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = registrationSchema.parse({ body: req.body }).body;
    const user = await registerUser(parsed);
    ResponseHandler.success(res, user, 'Registration completed successfully');
  } catch (err) {
    next(err);
  }
};
