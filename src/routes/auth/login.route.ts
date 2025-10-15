import { Router } from "express";
import { loginController } from "../../controller/auth/login.controller";
import { isAuthenticated } from "../../middleware/auth.middleware";
import { ResponseHandler } from "../../utils/responseHandler";
const router = Router();

router.post("/login", loginController);

router.get("/me",isAuthenticated, (req, res) => {  
  return ResponseHandler.success(res,req.user ,"Fetched user details successfully" );
});

export default router;