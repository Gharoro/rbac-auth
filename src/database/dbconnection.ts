import mongoose from "mongoose";
import { logger } from "../utils/logger";

export const connectDb = async (): Promise<void> => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/authDB"
    );
    logger.info("MongoDB connected");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export const closeDbConnection = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed.");
  } catch (err) {
    logger.error("Error closing MongoDB connection:", err);
    throw err;
  }
};
