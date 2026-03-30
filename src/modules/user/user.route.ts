import express from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { userController } from "./user.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";



const userRouter = express.Router();

//  current user
userRouter.get("/me", authMiddleware, userController.getMe);
userRouter.patch("/me", authMiddleware, userController.updateMe);

//  admin only
userRouter.delete("/", authMiddleware, userController.deleteUser);
userRouter.get("/", authMiddleware, userController.getAllUsers);

export default userRouter;