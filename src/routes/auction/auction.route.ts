import { Router } from "express";
import { createAuctionController , getAllAuctionsController ,deleteAuctionController, getAuctionsBySlugController} from "../../controller/auction/auction.controller";


const router = Router();

router.post("/", createAuctionController);
router.get("/", getAllAuctionsController);
router.get("/:slug", getAuctionsBySlugController);
router.delete("/:slug", deleteAuctionController);

export default router;