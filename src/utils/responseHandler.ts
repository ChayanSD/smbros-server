import { Response } from 'express';

export type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: string | Record<string, any>;
};

export class ResponseHandler {
  static success<T>(res: Response, data?: T, message = 'Success', status = 200): Response {
    const body: ApiResponse<T> = {
      success: true,
      message,
      data,
    };
    return res.status(status).json(body);
  }

  static created<T>(res: Response, data?: T, message = 'Created'): Response {
    return this.success(res, data, message, 201);
  }

  static error(res: Response, error: string | Record<string, any>, status = 500): Response {
    const body: ApiResponse = {
      success: false,
      error,
    };
    return res.status(status).json(body);
  }
}
