import express from "express";

import userRouter from "../modules/user/user.route";



const router = express.Router();
router.use("/users", userRouter)


export default router;