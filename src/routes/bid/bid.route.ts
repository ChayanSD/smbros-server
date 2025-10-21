import { Router } from "express";
import {
  createBidController,
  getBidsByAuctionItemController,
  getUserBidsController,
} from "../../controller/bid/bid.controller";
import { validate } from "../../middleware/validate";
import { BidCreateSchema } from "../../schemas/bid/bid.shema";
import { isAuthenticated } from "../../middleware/auth.middleware";

const router = Router();

// All bid routes require authentication
router.use(isAuthenticated);

router.post("/", validate(BidCreateSchema, "body"), createBidController);
router.get("/auction-item/:auctionItemId", getBidsByAuctionItemController);
router.get("/my-bids", getUserBidsController);

export default router;