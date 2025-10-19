import { Router } from "express";
import { loginController } from "../../controller/auth/login.controller";
import { isAuthenticated } from "../../middleware/auth.middleware";
import { ResponseHandler } from "../../utils/responseHandler";
const router = Router();

router.post("/login", loginController);

router.get("/me",isAuthenticated, (req, res) => {  
  return ResponseHandler.success(res,req.user ,"Fetched user details successfully" );
});

router.post('/logout', (req, res) => {
  if (!req.session) {
    return res.status(200).json({ success: true, message: 'No active session' });
  }
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.clearCookie('connect.sid', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });

    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  });
});

export default router;