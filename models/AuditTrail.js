// server/models/AuditLog.js
import mongoose from "mongoose";

// Define the schema for the audit log
const AuditLogSchema = new mongoose.Schema({
  collection: { type: String },
  documentId: { type: mongoose.Schema.Types.ObjectId },
  operation: {
    type: String,
  }, // Type of operation
  timestamp: { type: Date, default: Date.now },
});

const auditModel = mongoose.model("AuditLog", AuditLogSchema);
export default auditModel;
