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


      if (!documentId || !mongoose.Types.ObjectId.isValid(documentId)) {
        // console.error("Invalid Document ID:", documentId);
        return;
      }

      const user = req.user ? req.user.name : "Anonymous";
      const authorisedPerson = "Unknown";

      try {
        const existingDocument = await model.findById(documentId);
        if (!existingDocument) {
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
      } catch (error) {
        console.error("Failed to create audit log:", error.message);
      }
    }
  });

  next();
};

export default auditMiddleware;
