import { Request, Response, NextFunction } from "express";
import { loginUserService } from "../../services/auth/login.service";
import { ResponseHandler } from "../../utils/responseHandler";

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await loginUserService(req.body);

    // Store session (if Redis-based session middleware is configured)
    req.session.userId = user.id;
    console.log("Session userId set to:", req.session.userId);
    // Send standardized success response
    return ResponseHandler.success(res, user, "Login successful");
  } catch (error: any) {
   next(error);
  }
};
