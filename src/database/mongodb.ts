import mongoose from "mongoose";
import { MONGO_URI } from "../config";
import { logger } from "../utils/logger";

export async function connectdb() {
    try {
        await mongoose.connect(MONGO_URI);
        logger.info("database_connected", { mongoUri: MONGO_URI.replace(/\/\/.*@/, "//***:***@") });
    } catch (error) {
        logger.error("database_connection_failed", { error: error instanceof Error ? error.message : error as unknown as string });
        process.exit(1); 
    }
}