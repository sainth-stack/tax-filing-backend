// routes/notificationRoutes.js
import express from "express";
import {
  createNotification,
  deleteNotification,
  getAllNotifications,
  getNotificationById,
  updateNotification,
} from "../controllers/NotificationController.js";

const router = express.Router();

router.post("/notifications", createNotification);

//router.post("/notifications/:agency", createNotification);

router.get("/notifications/all", getAllNotifications);
router.get("/notifications/:id", getNotificationById);
router.put("/notifications/:id", updateNotification);
router.delete("/notifications/:id", deleteNotification);

export default router;
