import { Router } from "express";
import { attachCardController, setupIntentController } from "../../controller/stripe/attatchCard.controller";
const router = Router();

router.post('/setup-intent', setupIntentController);
router.post('/attach-card', attachCardController);

export default router;