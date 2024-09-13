// server/middlewares/auditMiddleware.js

import mongoose from "mongoose";
import auditCompanyModel from "../models/AuditTrail.js";
import companyModel from "../models/companyModel.js";

const auditMiddleware = (model) => async (req, res, next) => {
  console.log(`Request method: ${req.method}`);

  res.on("finish", async () => {
    console.log(`Response finished with status code: ${res.statusCode}`);

    if (["POST", "PUT", "DELETE"].includes(req?.method)) {
      const operation =
        req?.method == "POST"
          ? "CREATE"
          : req?.method == "PUT"
          ? "UPDATE"
          : "DELETE";

      const collection = await model.collection.collectionName;

      let documentId;

      // Capture document ID based on method
      if (req.method === "POST") {
        // Assuming the document is created in this middleware or controller and the ID should be in the response
        documentId = res.locals.documentId || req.body._id;
      } else {
        documentId = req.params.id || req.body._id;
      }

      console.log("Document ID:", documentId);

      /*       console.log("Document ID:", documentId); */

      let authorisedPerson = "Unknown";
      try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(documentId)) {
          console.error("Invalid Company Details:", documentId);
          return;
        }

        const existingDocument = await companyModel.findById(documentId);
        /* console.log("Existing Document:", existingDocument); */
        if (existingDocument) {
          authorisedPerson = existingDocument.companyDetails.authorisedPerson;
        }
      } catch (error) {
        console.error("Failed to fetch existing document:", error.message);
      }

      const user = req.user ? req.user.username : "Anonymous"; // Replace with actual user identification

      try {
        const createdAudit = new auditCompanyModel({
          collection,
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
