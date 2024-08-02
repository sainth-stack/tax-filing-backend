import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import { PORT } from "./config/environment.js";
import dotenv from "dotenv";
import companyRoutes from "./routes/companyRoutes.js";
import serviceroutes from "./routes/serviceRoute.js";
import userRoutes from './routes/userRoute.js';
import  taskRoutes  from "./routes/taskRoutes.js";

dotenv.config();

//App Configuration
const app = express();
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
/* app.use(express.static(path.join(__dirname, "public"))); */

// Routes
app.use("/api", companyRoutes);
app.use("/api", serviceroutes);
app.use("/api", userRoutes);
app.use("/api", taskRoutes);

//Default Route
app.get("/", (req, res) => {
  res.send(`<h1>Welcome to Backend Server </h1>
    
  `);
});


//Server Configuration

const port = PORT || 3600;
app.listen(port, async () => {
  //Database Connection
  await connectDB();
  console.log("Server is running on port: " + port);
  console.log("secret", process.env.test_env);
});
