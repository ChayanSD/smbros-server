import { Request, Response } from "express";
import { ResponseHandler } from "../../utils/responseHandler";
import { AppError } from "../../utils/appError";
import { BidCreateSchema } from "../../schemas/bid/bid.shema";
import { bidService } from "../../services/bid/bid.service";

export const createBidController = async (req: Request, res: Response) => {
  try {
    const parsed = BidCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      const formattedErrors = parsed.error.format();
      return ResponseHandler.error(res, formattedErrors, 400);
    }

    const userId = req.session.user?.id;
    if (!userId) {
      return ResponseHandler.error(res, "User not authenticated", 401);
    }

    const bid = await bidService.createBid(parsed.data, userId);

    return ResponseHandler.created(res, bid, "Bid placed successfully");
  } catch (error) {
    if (error instanceof AppError) {
      return ResponseHandler.error(res, error.message, error.status);
    }
    console.error("[Create Bid Error]:", (error as Error).message);
    return ResponseHandler.error(res, "Internal server error", 500);
  }
};

export const getBidsByAuctionItemController = async (req: Request, res: Response) => {
  try {
    const { auctionItemId } = req.params;
    const bids = await bidService.getBidsByAuctionItem(auctionItemId);
    return ResponseHandler.success(res, bids, "Bids retrieved successfully");
  } catch (error) {
    if (error instanceof AppError) {
      return ResponseHandler.error(res, error.message, error.status);
    }
    console.error("[Get Bids Error]:", (error as Error).message);
    return ResponseHandler.error(res, "Internal server error", 500);
  }
};

export const getUserBidsController = async (req: Request, res: Response) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) {
      return ResponseHandler.error(res, "User not authenticated", 401);
    }

    const bids = await bidService.getUserBids(userId);
    return ResponseHandler.success(res, bids, "User bids retrieved successfully");
  } catch (error) {
    if (error instanceof AppError) {
      return ResponseHandler.error(res, error.message, error.status);
    }
    console.error("[Get User Bids Error]:", (error as Error).message);
    return ResponseHandler.error(res, "Internal server error", 500);
  }
};