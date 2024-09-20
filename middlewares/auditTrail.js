import mongoose from "mongoose";
import auditCompanyModel from "../models/AuditTrail.js";
import companyModel from "../models/companyModel.js";

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
          ? res.locals.companyId || req.body.companyId || req.user?.companyId
          : req.params.companyId || req.body.companyId;

      const user = req.user ? req.user.email : "Anonymous";
      let authorisedPerson = "Unknown";

      try {
        if (!mongoose.Types.ObjectId.isValid(documentId)) {
          console.error("Invalid Document ID:", documentId);
          return;
        }

        let existingDocument;
        if (req.method === "PUT") {
          // Fetch the updated document after the update operation
          existingDocument = await model.findByIdAndUpdate(
            documentId,
            req.body,
            { new: true }
          );
        } else {
          existingDocument = await model.findById(documentId);
        }

        if (!existingDocument) {
          return res.status(404).json({ message: "Document not found" });
        }

        // Create an audit log entry
        const createdAudit = new auditCompanyModel({
          collection: model.collection.collectionName,
          documentId,
          operation,
          user,
          authorisedPerson,
        });
        await createdAudit.save();
      } catch (error) {
        console.error("Failed to create audit log:", error.message);
      }
    }
  });

  next();
};

export default auditMiddleware;
