// routes/auditRoutes.js
import express from "express";
import AuditTrailModel from "../models/AuditTrail.js";

const router = express.Router();

router.get("/:featureName", async (req, res) => {
  try {
    const auditData = await AuditTrailModel.find({
      featureName: req.params.featureName,
    }).sort({ timestamp: -1 });
    res.json(auditData);
  } catch (error) {
    console.error("Error fetching audit trail:", error);
    res.status(500).send("Server error");
  }
});

export default router;
