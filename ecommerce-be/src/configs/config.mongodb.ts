import dotenv from "dotenv";
import { AppConfig } from "./config.app";
dotenv.config();

const dev: AppConfig = {
  app: {
    port: process.env.DEV_APP_PORT || 8099,
  },
  db: {
    host: process.env.DEV_DB_HOST || "localhost",
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || "ecommerce",
  },
};

const pro: AppConfig = {
  app: {
    port: process.env.PRO_APP_PORT || 8099,
  },
  db: {
    host: process.env.PRO_DB_HOST || "localhost",
    port: process.env.PRO_DB_PORT || 27017,
    name: process.env.PRO_DB_NAME || "ecommerce",
  },
};

const mongoDbConfig = { dev, pro };
const env: "dev" | "pro" = process.env.NODE_ENV as "dev" | "pro" | "dev";
export default mongoDbConfig[env];
