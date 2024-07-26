// routes/serviceRoutes.js
import express from "express";
import {
  createService,
  deleteService,
  getServiceById,
  getServices,
  updateService,
} from "../controllers/serviceController.js";
const router = express.Router();

// Routes
router.post("/services", createService);
router.get("/services", getServices);
router.get("/services/:id", getServiceById);
router.put("/services/:id", updateService);
router.delete("/services/:id", deleteService);

export default router;
