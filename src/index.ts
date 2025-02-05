import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { closeDbConnection, connectDb } from "./database/dbconnection";
import { logger } from "./utils/logger";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import shipperRoutes from "./routes/shipper.routes";
import carrierRoutes from "./routes/carrier.routes";
import { authMiddleware } from "./middlewares/auth.middleware";
import { UserRole } from "./types/enum";
import { apiResponse } from "./utils/apiResponse";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json(apiResponse(true, "Application is healthy!"));
});
app.use("/api/auth", authRoutes);
// Protected route for Admins only
app.use("/api/admin", authMiddleware([UserRole.ADMIN]), adminRoutes);
// Protected route for Shippers only
app.use("/api/shipper", authMiddleware([UserRole.SHIPPER]), shipperRoutes);
// Protected route for Carriers only
app.use("/api/carrier", authMiddleware([UserRole.CARRIER]), carrierRoutes);

// Start server
const startServer = async () => {
  await connectDb(); // Connect to MongoDB
  const server = app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    try {
      await closeDbConnection();
      server.close(() => {
        logger.info("Server closed.");
        process.exit(0); // Exit process after everything is closed
      });
    } catch (err) {
      logger.error("Error during shutdown:", err);
      process.exit(1); // Exit with failure if there's an error
    }
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

startServer();
