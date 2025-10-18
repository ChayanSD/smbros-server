import { Router } from "express";
import { createAuctionItemController , getAuctionItemByIdController ,deleteAuctionItemController,getAuctionItemsController } from "../../controller/auction/auctionItem.controller";

const router = Router();

router.post("/",createAuctionItemController);
router.get("/",getAuctionItemsController);
router.get("/:id",getAuctionItemByIdController);
router.delete("/:id",deleteAuctionItemController);

export default router;