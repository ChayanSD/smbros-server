import { Router } from "express";
import { attachCardController, setupIntentController } from "../../controller/stripe/attachCard.controller";
import { validate } from "../../middleware/validate";
import { setupIntentSchema, attachCardSchema } from "../../schemas/stripe/attachCard.schema";

const router = Router();

router.post('/setup-intent', validate(setupIntentSchema, 'body'), setupIntentController);
router.post('/attach-card', validate(attachCardSchema, 'body'), attachCardController);

export default router;