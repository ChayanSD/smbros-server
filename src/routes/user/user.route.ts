import { Router } from "express";

import { getUserByIdController, getAllUsersController } from "../../controller/user/user.controller";
import { isAdmin } from "../../middleware/admin.middleware";

const router = Router();

router.get("/:id", getUserByIdController);
router.get("/", isAdmin, getAllUsersController);

export default router;