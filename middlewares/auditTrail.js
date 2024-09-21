import mongoose from "mongoose";
import auditCompanyModel from "../models/AuditTrail.js";

const auditMiddleware = (model) => async (req, res, next) => {
  res.on("finish", async () => {
    if (["POST", "PUT", "DELETE"].includes(req.method)) {
      const operation =
        req.method === "POST"
          ? "CREATE"
          : req.method === "PUT"
          ? "UPDATE"
          : "DELETE";

      const documentId =
        req.method === "POST"
          ? res.locals.companyId // For POST, document ID is from created company
          : req.params.id || req.body.companyId; // For PUT/DELETE, from params or body

      console.log("documentId in audit middleware:", documentId);

      if (!documentId || !mongoose.Types.ObjectId.isValid(documentId)) {
        console.error("Invalid Document ID:", documentId);
        return;
      }

      const user = req.user ? req.user.email : "Anonymous";
      const authorisedPerson = "Unknown";

      try {
        const existingDocument = await model.findById(documentId);
        if (!existingDocument) {
          console.error("Document not found for audit logging");
          return;
        }

        // Save the audit log
        const auditLog = new auditCompanyModel({
          collection: model.collection.collectionName,
          documentId,
          operation,
          user,
          authorisedPerson,
        });

        await auditLog.save();
        console.log("Audit log created successfully:", auditLog);
      } catch (error) {
        console.error("Failed to create audit log:", error.message);
      }
    }
  });

  next();
};

export default auditMiddleware;
