// server/routes/companyRoutes.js
import express from "express";
import {
  createCompany,
  deleteCompany,
  getAllCompanies,
  getCompanies,
  getCompanyById,
  updateCompany,
  uploadFiles,
} from "../controllers/companyController.js";
import upload from "../middlewares/multer.js";
import companyModel from "../models/companyModel.js";
import auditMiddleware from "../middlewares/auditTrail.js";

const router = express.Router();

router.post("/companies", auditMiddleware(companyModel), createCompany);
router.put("/companies/:id", auditMiddleware(companyModel), updateCompany);
router.delete("/companies/:id", auditMiddleware(companyModel), deleteCompany);

// Non-modifying routes don't need the audit middleware
router.get("/companies/all", getAllCompanies);
router.post("/companies/filter", getCompanies);
router.get("/companies/:id", getCompanyById);

// Separate route for file uploads, no audit required
router.post("/files", upload.any(), uploadFiles);

export default router;
