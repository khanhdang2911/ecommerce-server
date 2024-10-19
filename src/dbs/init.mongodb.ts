import mongoose from "mongoose";
import { countConnect } from "../helpers/check.connect";
import mongoDbConfig from "../configs/config.mongodb";

const MONGO_DB_URL = `mongodb://${mongoDbConfig.db.host}:${mongoDbConfig.db.port}/${mongoDbConfig.db.name}`;

class Database {
  private static INSTANCE: Database;
  private constructor() {
    this.connect();
  }
  private connect() {
    mongoose
      .connect(MONGO_DB_URL)
      .then((_) => {
        console.log("Connected to database successfully");
        countConnect();
      })
      .catch((err) => {
        console.log("Error connecting to database", err);
      });
  }
  public static getInstance(): Database {
    if (!this.INSTANCE) {
      this.INSTANCE = new Database();
    }
    return Database.INSTANCE;
  }
}

const mongoInstance = Database.getInstance();
export default mongoInstance;
