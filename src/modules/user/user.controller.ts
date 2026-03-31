import { Request, Response } from "express";
import { userService } from "./user.service";


// GET ME
 const getMe = async (req: Request, res: Response) => {
  const user = await userService.getMe(req.user!.id);

  res.json({
    success: true,
    data: user,
  });
};

// UPDATE ME
 const updateMe = async (req: Request, res: Response) => {
  const user = await userService.updateMe(req.user!.id, req.body);

  res.json({
    success: true,
    message: "User updated successfully",
    data: user,
  });
};

// ADMIN: DELETE USER
const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  await userService.deleteUser(id);

  res.json({
    success: true,
    message: "User deleted successfully",
  });
};

// ADMIN: GET ALL USERS
 const getAllUsers = async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();

  res.json({
    success: true,
    data: users,
  });
};
export const userController ={
    getMe,  
    updateMe,
    deleteUser,
    getAllUsers

}