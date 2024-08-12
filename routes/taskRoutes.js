// routes/TasksRoutes.js

import express from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
  uploadFiles,
} from "../controllers/taskController.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// Routes
router.post("/tasks",upload.any(), createTask);
router.post("/tasks/filter", getTasks);
router.get("/tasks/:id", getTaskById);
router.put("/tasks/:id",upload.any(), updateTask);
router.delete("/tasks/:id", deleteTask);

export default router;
