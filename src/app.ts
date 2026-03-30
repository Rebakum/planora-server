import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { Application } from "express";
import { auth } from "./lib/auth";
import config from "./middlewares/config";
import router from "./routes/index";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { validateRequest } from "./middlewares/validate";


const app: Application = express();

app.use(cookieParser());

const allowedOrigins = [
  config.frontend_url,
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins as string[],
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Better Auth
if (process.env.NODE_ENV === "development") {
  app.use("/api/auth", (req, res, next) => {
    console.log("AUTH HIT:", req.method, req.url);
    next();
  });
}

app.use("/api/auth", toNodeHandler(auth));

// API routes
app.use("/api/v1", router);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to Planora API 🚀");
});

export default app;