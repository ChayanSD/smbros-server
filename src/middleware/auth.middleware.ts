import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../utils/responseHandler";
import { prisma } from "../lib/db";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return ResponseHandler.error(res, "Unauthorized: Not logged in", 401);
    }

    // 2. Optionally load user info from DB (only if needed)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isVerified: true,
        accountType: true,
      },
    });

    if (!user) {
      req.session.destroy(() => {});
      return ResponseHandler.error(res, "User not found or deleted", 401);
    }

    req.user = user; 
    
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return ResponseHandler.error(res, "Internal server error", 500);
  }
};
