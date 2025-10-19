import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../utils/responseHandler";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const user = req.session.user;
    const role = user?.accountType;
    if (!role) {
      return ResponseHandler.error(res, "Unauthorized: No user session found", 401);
    }

    if (role !== "Admin") {
      return ResponseHandler.error(res, "Forbidden: Admin access only", 403);
    }

    next();
  } catch (err) {
    console.error("Admin middleware error:", err);
    return ResponseHandler.error(res, "Internal server error", 500);
  }
};
