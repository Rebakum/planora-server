import express from "express";
import {  getMySessions, loginController, logoutAllDevices, refreshTokenController, signup, verifyOTP } from "./auth.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { validateRequest } from "../../middlewares/validate";
import { authValidation } from "./auth.validation";




const router = express.Router();


router.post("/signup", validateRequest(authValidation.signupSchema), signup);
router.post("/verify-otp", validateRequest(authValidation.otpSchema), verifyOTP);
router.post("/login", validateRequest(authValidation.loginSchema), loginController);
router.post("/refresh-token", refreshTokenController);
router.get("/sessions", authMiddleware, getMySessions);
router.post("/logout", authMiddleware, logoutAllDevices );

export const authRouter = router;