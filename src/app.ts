import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { Application } from "express";
import { auth } from "./lib/auth";


const app: Application = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true,
  })
);
app.all("/api/auth/*splat", toNodeHandler(auth));



app.get("/", (req, res) => {
  res.send("Welcome to Prisma Blog Application API");
});

export default app;
