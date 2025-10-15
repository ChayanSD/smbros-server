// src/middleware/validate.ts
import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';
import { ValidationError } from '../utils/appError';

type ValidationTargets = 'body' | 'query' | 'params';

export const validate =
  (schema: ZodType, target: ValidationTargets = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[target]);
      next();
    } catch (err: any) {
      throw new ValidationError('Invalid input', err.errors);
    }
  };
