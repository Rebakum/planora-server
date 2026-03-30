import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

export const bootstrapSuperAdmin = async () => {
  try {
    const adminEmail = "admin@planora.com";

    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log("Super Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const admin = await prisma.user.create({
      data: {
        name: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "SUPER_ADMIN",
      },
    });

    console.log("Super Admin created successfully:", admin.email);
  } catch (error) {
    console.error("Bootstrap admin error:", error);
  }
};