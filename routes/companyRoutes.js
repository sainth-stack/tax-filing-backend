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
import saveChangedData from "../middlewares/auditTrail.js";

const router = express.Router();

router.post(
  "/companies",
  saveChangedData("companies", "Company"),
  createCompany
);

router.put(
  "/companies/:id",
  saveChangedData("companies", "Company"),
  updateCompany
);

router.delete(
  "/companies/:id",
  saveChangedData("companies", "Company"),
  deleteCompany
);

router.get("/companies/all", getAllCompanies);

router.post("/companies/filter", getCompanies);

router.get("/companies/:id", getCompanyById);

router.post("/files", upload.any(), uploadFiles);

export default router;
