// server/middlewares/auditMiddleware.js

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

      const collection = model.collection.collectionName;

      const documentId = req.params.id || req.body._id;
      const isValidObjectId = mongoose.Types.ObjectId.isValid(documentId);

      const changes = { ...req.body };

      /* console.log(collection, documentId, operation, changes);
      console.log(
        "model",
        model,
        model.collection,
        model.collection.collectionName
      ); */

      console.log("collection test", changes);

      // Replace with actual user
      const user = changes.companyDetails.authorisedPerson;
      console.log("user test", user);
      try {
        await auditCompanyModel.create({
          collection,
          documentId: isValidObjectId ? documentId : undefined,
          operation,
          user,
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
