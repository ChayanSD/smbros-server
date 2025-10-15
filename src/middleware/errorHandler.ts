import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { ResponseHandler } from '../utils/responseHandler';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[Error] ${req.method} ${req.url}`, err);

  if (err instanceof AppError) {
    return ResponseHandler.error(
      res,
      { message: err.message, details: err.details },
      err.status
    );
  }

 return ResponseHandler.error(res, { message: 'Internal Server Error' }, 500);
};
