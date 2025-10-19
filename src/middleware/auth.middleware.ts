import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../utils/responseHandler";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.session.user;

    // If no session or user info, block access
    if (!user || !user.id || !user.email || !user.accountType) {
      return ResponseHandler.error(res, "Unauthorized: Not logged in", 401);
    }

    // Attach the user object from session to req for convenience
    req.user = user;

    // Proceed — no DB hit needed
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return ResponseHandler.error(res, "Internal server error", 500);
  }
};
