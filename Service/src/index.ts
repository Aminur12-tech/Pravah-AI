
import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";

import healthRoutes from "./routes/health.routes.js";
import incidentRoutes from "./routes/incident.routes.js";
import authRoutes from "./routes/auth.routes.js";

import {
  notFoundHandler,
  errorHandler,
} from "./middleware/error.middleware.js";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/api/health", healthRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/auth", authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Pravah AI API: http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("Failed to start Pravah AI:", error);
    process.exit(1);
  }
}

startServer();
