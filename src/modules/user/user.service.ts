import { prisma } from "../../lib/prisma";

 const getMe = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
  });
};

 const updateMe = async (
  userId: string,
  payload: { name?: string; phone?: string }
) => {
  return prisma.user.update({
    where: { id: userId },
    data: payload,
  });
};

 const deleteUser = async (userId: string) => {
  return prisma.user.delete({
    where: { id: userId },
  });
};

// ADMIN ONLY
 const getAllUsers = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
};
export const userService = {
    getMe,
    updateMe,
    deleteUser,
    getAllUsers
}