import { Request, Response } from "express";
import { ResponseHandler } from "../../utils/responseHandler";
import { AppError } from "../../utils/appError";
import { auctionItemService } from "../../services/auction/auctionItem.service";
import { AuctionItemCreateSchema } from "../../schemas/auction/auctionItem.schema";

export const createAuctionItemController = async (
  req: Request,
  res: Response,
) => {
  try {
    const parsed = AuctionItemCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      return ResponseHandler.error(res, parsed.error, 400);
    }
    const auctionItem = await auctionItemService.createAuctionItem(parsed.data);

    return ResponseHandler.created(res, auctionItem, "Auction item created successfully");
  } catch (error) {
    if (error instanceof AppError) {
      return ResponseHandler.error(res, error.message, error.status);
    }
    console.error("[Create Auction Item Error]:", (error as Error).message);
    return ResponseHandler.error(res, "Internal server error", 500);
  }
};

export const getAuctionItemsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const auctionItems = await auctionItemService.getAllAuctionItems();
    return ResponseHandler.success(res, auctionItems, "Auction items retrieved successfully");
  } catch (error) {
    if (error instanceof AppError) {
      return ResponseHandler.error(res, error.message, error.status);
    }
    console.error("[Get Auction Items Error]:", (error as Error).message);
    return ResponseHandler.error(res, "Internal server error", 500);
  }
};


export const getAuctionItemByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const auctionItem = await auctionItemService.getAuctionItemById(id);
    if (!auctionItem) {
      return ResponseHandler.error(res, "Auction item not found", 404);
    }
    return ResponseHandler.success(res, auctionItem, "Auction item retrieved successfully");
  } catch (error) {
    if (error instanceof AppError) {
      return ResponseHandler.error(res, error.message, error.status);
    }
    console.error("[Get Auction Item By ID Error]:", (error as Error).message);
    return ResponseHandler.error(res, "Internal server error", 500);
  }
};

export const deleteAuctionItemController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    await auctionItemService.deleteAuctionItem(id);
    return ResponseHandler.success(res, null, "Auction item deleted successfully");
  } catch (error) {
    if (error instanceof AppError) {
      return ResponseHandler.error(res, error.message, error.status);
    }
    console.error("[Delete Auction Item Error]:", (error as Error).message);
    return ResponseHandler.error(res, "Internal server error", 500);
  }
};