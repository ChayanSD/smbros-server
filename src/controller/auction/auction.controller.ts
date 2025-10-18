import { Request, Response } from "express";
import { ResponseHandler } from "../../utils/responseHandler";
import { AppError } from "../../utils/appError";
import { AuctionCreateSchema } from "../../schemas/auction/auction.schema";
import { auctionService } from "../../services/auction/auction.service";


export const createAuctionController = async (
  req: Request,
  res: Response,
) => {
  try {
    const parsed = AuctionCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      const formattedErrors = parsed.error.format();
      return ResponseHandler.error(res, formattedErrors, 400);
    }

    const auction = await auctionService.createAuction(parsed.data);

    return ResponseHandler.created(res, auction, "Auction created successfully");
  } catch (error) {
    if (error instanceof AppError) {
      return ResponseHandler.error(res, error.message, error.status);
    }
    console.error("[Create Auction Error]:", (error as Error).message);
    return ResponseHandler.error(res, "Internal server error", 500);
  }
};

export const getAuctionsBySlugController = async (
  req: Request,
  res: Response,
) => {
  try {
    const auctions = await auctionService.getAuctionBySlug(req.params.slug);
    return ResponseHandler.success(res, auctions, "Auctions retrieved successfully");
  } catch (error) {
    if (error instanceof AppError) {
      return ResponseHandler.error(res, error.message, error.status);
    }
    console.error("[Get Auctions Error]:", (error as Error).message);
    return ResponseHandler.error(res, "Internal server error", 500);
  }
};

export const getAllAuctionsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const auctions = await auctionService.getAllAuctions();
    return ResponseHandler.success(res, auctions, "All auctions retrieved successfully");
  } catch (error) {
    if (error instanceof AppError) {
      return ResponseHandler.error(res, error.message, error.status);
    }
    console.error("[Get All Auctions Error]:", (error as Error).message);
    return ResponseHandler.error(res, "Internal server error", 500);
  }
};

export const deleteAuctionController = async (
  req: Request,
  res: Response,
) => {
  try {
    const slug = req.params.id;
    await auctionService.deleteAuctionBySlug(slug);
    return ResponseHandler.success(res, null, "Auction deleted successfully");
  } catch (error) {
    if (error instanceof AppError) {
      return ResponseHandler.error(res, error.message, error.status);
    }
    console.error("[Delete Auction Error]:", (error as Error).message);
    return ResponseHandler.error(res, "Internal server error", 500);
  }
};
