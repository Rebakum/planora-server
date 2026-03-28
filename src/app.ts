import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { Application } from "express";
import { auth } from "./lib/auth";

import config from "./middlewares/config";
import router from "./routes/index";


const app: Application = express();
app.use(express.json());
app.use(
cors({
  origin: [
    config.frontend_url as string,
    "http://localhost:3000",
  ],
  credentials: true,
})
)
// app.use("/api/auth", toNodeHandler(auth));
app.use("/api/auth", (req, res, next) => {
  console.log("AUTH HIT:", req.method, req.url);
  next();
}, toNodeHandler(auth));

app.use("/api",router)

app.get("/", (req, res) => {
  res.send("Welcome to Prisma Blog Application API");
});

export default app;
