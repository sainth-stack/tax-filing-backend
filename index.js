import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import { PORT } from "./config/environment.js";
import companyRoutes from "./routes/companyRoutes.js";
import serviceRoutes from "./routes/serviceRoute.js";
import userRoutes from "./routes/userRoute.js";
import auditRoutes from "./routes/auditRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import agencyRoutes from "./routes/AgencyRoutes.js";

import "./middlewares/cronjob.js";
import './middlewares/cronjob-email.js'

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware configuration
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Register routes
app.use("/api", auditRoutes);
app.use("/api", companyRoutes);
app.use("/api", serviceRoutes);
app.use("/api", userRoutes);
app.use("/api", taskRoutes);
app.use('/api', agencyRoutes);

// Default route
app.get("/", (req, res) => {
  res.send(`<h1>Welcome to Backend Running On port: ${PORT} Server</h1>`);
});

// Start the server and connect to the database
const port = PORT || 3600;
app.listen(port, async () => {
  await connectDB();
  console.log(`Server is running on port ${port}`);
});
