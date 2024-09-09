// server/middlewares/auditMiddleware.js

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

      const collection = model.collection.collectionName;
      const documentId = req.params.id || req.body._id;

      console.log("Document ID:", documentId);

      let authorisedPerson = "Unknown";
      try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(documentId)) {
          console.error("Invalid ObjectId:", documentId);
          return;
        }

        const existingDocument = await companyModel.findById(documentId);
        console.log("Existing Document:", existingDocument);
        if (existingDocument) {
          authorisedPerson = existingDocument.companyDetails.authorisedPerson;
        }
      } catch (error) {
        console.error("Failed to fetch existing document:", error.message);
      }

      const changes = { ...req.body };

      const user = req.user ? req.user.username : "Anonymous"; // Replace with actual user identification

      try {
        await auditCompanyModel.create({
          collection,
          documentId,
          operation,
          user,
          authorisedPerson,
          changes,
        });
      } catch (error) {
        console.error("Failed to create audit log:", error.message);
      }
    }
  });

  next();
};

export default auditMiddleware;
