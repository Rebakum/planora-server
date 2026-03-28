import express from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { userController } from "./user.controller";



const userRouter = express.Router();

//  current user
userRouter.get("/me", auth(), userController.getMe);
userRouter.patch("/me", auth(), userController.updateMe);

//  admin only
userRouter.delete("/", auth(UserRole.admin), userController.deleteUser);
userRouter.get("/", auth(UserRole.admin), userController.getAllUsers);

export default userRouter;