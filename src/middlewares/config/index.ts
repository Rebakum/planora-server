import dotenv from "dotenv";
import { validateEnv } from "./envValidation";


dotenv.config();
validateEnv();

const config = {
  port: process.env.PORT || 4000,
  node_env: process.env.NODE_ENV || "development",

  database_url: process.env.DATABASE_URL!,

  jwt: {
    secret: process.env.JWT_ACCESS_SECRET!,
    expires_in: process.env.JWT_EXPIRES_IN!,
  },

  refresh_token: {
    secret: process.env.JWT_REFRESH_SECRET!,
    expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN!,
  },

  better_auth: {
    secret: process.env.BETTER_AUTH_SECRET!,
    url: process.env.BETTER_AUTH_URL!,
  },

  google: {
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
  },

  email: {
    user: process.env.APP_USER!,
    pass: process.env.APP_PASSWORD!,
  },

  admin: {
    email: process.env.ADMIN_EMAIL!,
    password: process.env.ADMIN_PASSWORD!,
  },

  frontend_url: process.env.FRONTEND_URL!,
  backend_url: process.env.BACKEND_URL!,
};

export default config;