// models/AuditTrail.js
import mongoose from "mongoose";

const AuditTrailSchema = new mongoose.Schema({
  dataDocument: { type: Object, required: true },
  collectionName: { type: String, required: true },
  userId: { type: String, required: true },
  featureName: { type: String, required: true },
  operation: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("AuditTrail", AuditTrailSchema);
