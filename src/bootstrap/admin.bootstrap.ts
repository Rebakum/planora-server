import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";
import config from "../middlewares/config";


export const bootstrapSuperAdmin = async () => {
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: config.admin.email },
    });

    if (existingAdmin) {
      console.log("Super Admin already exists");
      return; 
    }

    const hashedPassword = await bcrypt.hash(
      config.admin.password,
      10
    );

    await prisma.user.create({
      data: {
        name: "Super Admin",
        email: config.admin.email,
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });

    console.log("🔥 Super Admin created successfully");
  } catch (error) {
    console.error("❌ Bootstrap admin error:", error);
  }
};