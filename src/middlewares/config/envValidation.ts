import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),

  PORT: z.string().optional(),
  NODE_ENV: z.string().optional(),

  JWT_SECRET: z.string().optional(),
  JWT_EXPIRES_IN: z.string().optional(),

  REFRESH_TOKEN_SECRET: z.string().optional(),
  REFRESH_TOKEN_EXPIRES_IN: z.string().optional(),

  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),

  APP_USER: z.string(),
  APP_PASSWORD: z.string(),
});

export const validateEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Invalid environment variables");
    console.log(result.error.format());
    process.exit(1);
  }
};