// server/middlewares/auditMiddleware.js

import mongoose from "mongoose";
import auditModel from "../models/AuditTrail.js";

const auditMiddleware = (model) => async (req, res, next) => {
  res.on("finish", async () => {
    if (["POST", "PUT", "DELETE"].includes(req.method)) {
      const operation =
        req.method === "POST"
          ? "CREATE"
          : req.method === "PUT"
          ? "UPDATE"
          : "DELETE";

      const collection = model.modelName;

      const documentId = req.params.id || req.body._id;

      const isValidObjectId = mongoose.Types.ObjectId.isValid(documentId);

      const changes = { ...req.body };

      const user = req.user ? req.user.id : "Unknown";

      try {
        await auditModel.create({
          collection,
          documentId: isValidObjectId ? documentId : undefined,
          operation,
          changes,
          user,
        });
      } catch (error) {
        console.error("Failed to create audit log:", error.message);
      }
    }
  });

  // Continue to the next middleware or route handler
  next();
};

export default auditMiddleware;
