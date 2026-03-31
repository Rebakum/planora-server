import express from "express";
import {  getMySessions, loginController, logoutAllDevices, refreshTokenController, resendOTP, signup, verifyOTP } from "./auth.controller";

import { validateRequest } from "../../middlewares/validate";
import { authValidation } from "./auth.validation";
import auth from "../../middlewares/authMiddleware";






const router = express.Router();


router.post("/signup", validateRequest(authValidation.signupSchema), signup);
router.post("/verify-otp", validateRequest(authValidation.otpSchema), verifyOTP);
router.post("/resend-otp", validateRequest(authValidation.resendOtpSchema), resendOTP);
router.post("/login", validateRequest(authValidation.loginSchema), loginController);
router.post("/refresh-token", refreshTokenController);
router.get("/sessions", auth(), getMySessions);
router.post("/logout", auth(), logoutAllDevices);

export const authRouter = router;