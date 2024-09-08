// middlewares/auditTrail.js
import AuditTrailModel from "../models/AuditTrail.js";

const saveChangedData = (collectionName, featureName) => {
  return async (req, res, next) => {
    let operation;

    switch (req.method) {
      case "POST":
        operation = "Create";
        break;
      case "PUT":
        operation = "Update";
        break;
      case "DELETE":
        operation = "Delete";
        break;
      default:
        operation = "Unknown";
    }

    const commonData = {
      dataDocument: req.body,
      collectionName,
      userId: req.body.userId || req.body.employeeReferenceId,
      featureName,
    };

    try {
      await saveData(operation, commonData, req);
      next();
    } catch (err) {
      console.error("Audit trail error:", err);
      next();
    }
  };
};

async function saveData(operation, commonData, req) {
  const newChangeData = new AuditTrailModel({
    ...commonData,
    operation,
    timestamp: new Date(), // Ensure timestamp is set when saving
  });

  const result = await newChangeData.save();
  req.auditId = result._id;
}

export default saveChangedData;
