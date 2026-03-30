import app from "./app";
import { bootstrapSuperAdmin } from "./bootstrap/admin.bootstrap";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 4000;

async function main() {
  try {
    await prisma.$connect();
    await bootstrapSuperAdmin()

    console.log("Connected to the database successfully");
    app.listen(PORT, () => {
      console.log(`server is runing on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("An error occurred", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
