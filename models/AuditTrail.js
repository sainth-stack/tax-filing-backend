// server/models/AuditLog.js
import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema({
  collection: { type: String },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "collection",
  },
  user: { type: String },
  authorisedPerson: { type: String }, // Add authorisedPerson field
  operation: { type: String },
  // To store changes made in the document
  timestamp: { type: Date, default: Date.now },
});

const auditCompanyModel = mongoose.model("AuditLog", AuditLogSchema);
export default auditCompanyModel;
