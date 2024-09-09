// server/models/AuditLog.js
import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema({
  collection: { type: String },
  documentId: { type: mongoose.Schema.Types.ObjectId },
  user: { type: String },
  operation: {
    type: String,
  },

  timestamp: { type: Date, default: Date.now },
});

const auditCompanyModel = mongoose.model("AuditLog", AuditLogSchema);
export default auditCompanyModel;
