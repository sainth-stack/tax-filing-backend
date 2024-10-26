// routes/TasksRoutes.js

import express from "express";
import upload from "../middlewares/multer.js";
import {
  createAutoTask,
  deleteAutoTask,
  getAllAutoTasks,
  getAutoTaskById,
  getAutoTasks,
  updateAutoTask,
} from "../controllers/AutoTaskController.js";

const router = express.Router();

// Routes
router.get("/tasks/auto/all", getAllAutoTasks);

router.post("/tasks/auto/", upload.any(), createAutoTask);
router.post("/tasks/auto/filter", getAutoTasks);
router.get("/tasks/auto/:id", getAutoTaskById);
router.put("/tasks/auto/:id", upload.any(), updateAutoTask);
router.delete("/tasks/auto/:id", deleteAutoTask);

export default router;
