import express from "express";

import { userController } from "./user.controller";
import auth from "../../middlewares/authMiddleware";




const userRouter = express.Router();

//  current user
userRouter.get("/me",auth(), userController.getMe);
userRouter.patch("/me",auth(), userController.updateMe);

//  admin only
userRouter.delete("/:id",auth("ADMIN"), userController.deleteUser);
userRouter.get("/",auth("ADMIN"), userController.getAllUsers);

export default userRouter;