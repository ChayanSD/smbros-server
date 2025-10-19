import { Request, Response } from "express";
import { ResponseHandler } from "../../utils/responseHandler";
import { AppError } from "../../utils/appError";
import { userService } from "../../services/user/user.service";

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    if (!user) {
      return ResponseHandler.error(res, "User not found", 404);
    }
    return ResponseHandler.success(res, user, "User retrieved successfully");
  } catch (error) {
    if (error instanceof AppError) {
      return ResponseHandler.error(res, error.message, error.status);
    }
    console.error("[Fetch user by id  Error]:", (error as Error).message);
    return ResponseHandler.error(res, "Internal server error", 500);
  }
};

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    return ResponseHandler.success(
      res,
      users,
      "All users retrieved successfully"
    );
  } catch (error) {
    if (error instanceof AppError) {
      return ResponseHandler.error(res, error.message, error.status);
    }
    console.error("[Fetch all users Error]:", (error as Error).message);
    return ResponseHandler.error(res, "Internal server error", 500);
  }
};
