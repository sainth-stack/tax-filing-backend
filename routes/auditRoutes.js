// server/routes/auditRoutes.js
import express from "express";
import auditCompanyModel from "../models/AuditTrail.js";
import mongoose from "mongoose";

const router = express.Router();

router.post("/audit-history", async (req, res) => {
  try {
    const { documentId } = req?.body;

    if (!documentId || !mongoose.Types.ObjectId.isValid(documentId)) {
      return res
        .status(400)
        .json({ error: "Invalid or missing document ID format" });
    }

    const logs = await auditCompanyModel
      .find({ documentId: new mongoose.Types.ObjectId(documentId) })
      .sort({ timestamp: -1 });

    res.send({
      message: "Audit Logs",
      logs: logs,
      NoOfLogs: logs.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
