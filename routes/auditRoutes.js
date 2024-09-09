// server/routes/auditRoutes.js
import express from "express";
import auditModel from "../models/AuditTrail.js";

const router = express.Router();

// Route to fetch audit logs
router.get("/audit-logs", async (req, res) => {
  try {
    const logs = await auditModel.find().sort({ timestamp: -1 });
    res.status(200).json({
      message: "audit Logs",
      logs: logs,
      NoOfLogs: logs.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
