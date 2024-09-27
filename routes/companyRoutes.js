// server/routes/companyRoutes.js
import express from "express";
import {
  createCompany,
  deleteCompany,
  getAllCompanies,

  getCompanyById,
  getFilterCompanies,
  updateCompany,
  uploadFiles,
} from "../controllers/companyController.js";
import upload from "../middlewares/multer.js";
import companyModel from "../models/companyModel.js";
import auditMiddleware from "../middlewares/auditTrail.js";
import { isAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/companies", isAuth, auditMiddleware(companyModel), createCompany);
router.put(
  "/companies/:id",
  isAuth,
  auditMiddleware(companyModel),
  updateCompany
);
router.delete(
  "/companies/:id",
  isAuth,
  auditMiddleware(companyModel),
  deleteCompany
);

// Non-modifying routes don't need the audit middleware
router.get("/companies/all", getAllCompanies);
router.post("/companies/filter", getFilterCompanies);
router.get("/companies/:id", getCompanyById);

// Separate route for file uploads, no audit required
router.post("/files", upload.any(), uploadFiles);

export default router;
