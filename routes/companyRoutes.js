// routes/companyRoutes.js
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
const router = express.Router();

// Routes
router.get("/companies/all", getAllCompanies);
router.post("/companies", createCompany);
router.post("/companies/filter", getCompanies);
router.post("/files", upload.any(), uploadFiles);
router.get("/companies/:id", getCompanyById);
router.put("/companies/:id", updateCompany);
router.delete("/companies/:id", deleteCompany);

export default router;
