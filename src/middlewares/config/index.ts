import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  node_env: process.env.NODE_ENV,

  database_url: process.env.DATABASE_URL,

  jwt: {
    secret: process.env.JWT_SECRET as string,
    expires_in: process.env.JWT_EXPIRES_IN as string,
  },

  refresh_token: {
    secret: process.env.REFRESH_TOKEN_SECRET as string,
    expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
  },

  better_auth: {
    secret: process.env.BETTER_AUTH_SECRET as string,
    url: process.env.BETTER_AUTH_URL as string,
  },

  google: {
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
  },

  email: {
    user: process.env.APP_USER as string,
    pass: process.env.APP_PASSWORD as string,
  },

  frontend_url: process.env.FRONTEND_URL,
  backend_url: process.env.BACKEND_URL,
};

export default config;