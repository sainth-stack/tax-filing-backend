// server/models/AuditLog.js
import mongoose from "mongoose";
const auditTrailSchema = new mongoose.Schema({
  collection: String,
  documentId: mongoose.Schema.Types.ObjectId,
  operation: String,
  user: String,
  authorisedPerson: String,
  changes: mongoose.Schema.Types.Mixed, // To store the changes in key-value format
  timestamp: { type: Date, default: Date.now },
});

const auditCompanyModel = mongoose.model("AuditTrail", auditTrailSchema);
export default auditCompanyModel;
