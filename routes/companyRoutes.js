// routes/companyRoutes.js
import express from "express";
import {
  createCompany,
  deleteCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
} from "../controllers/companyController.js";
const router = express.Router();

// Routes
router.post("/companies", createCompany);
router.get("/companies", getCompanies);
router.get("/companies/:id", getCompanyById);
router.put("/companies/:id", updateCompany);
router.delete("/companies/:id", deleteCompany);

export default router;
