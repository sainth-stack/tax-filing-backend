// controllers/companyController.js

import fs from "fs";
import companyModel from "../models/companyModel.js";
import { uploadFileToDrive } from "../middlewares/drive.js";
import path from "path";

/* create company controller */
export const createCompany = async (req, res) => {
  try {
    const companyData = {
      ...req.body,
    };

    const company = new companyModel(companyData);
    await company.save();
    console.log("Company created successfully", company);
    res.status(201).json(company);
  } catch (error) {
    console.error("Error creating company:", error);
    res.status(400).json({ error: error.message });
  }
};

/* file upload controller */
export const uploadFiles = async (req, res) => {
  console.log(req.files);
  try {
    /* getting files from input */
    const files = req.files;
    const fileLinks = {};

    for (const file of files) {
      const fileName = file.filename; // File name on disk
      const filePath = path.join(file.destination, file.filename); // Full path to the file
      const uploadResponse = await uploadFileToDrive(filePath);
      console.log(uploadResponse)
      fileLinks[file.fieldname] = uploadResponse?.url;
      fs.unlinkSync(filePath); // Clean up temp file
    }

    const { companyId } = req.body;
    const company = await companyModel.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    company.attachments = {
      ...company.attachments,
      ...fileLinks,
    };
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    console.error("Error creating company:", error);
    res.status(400).json({ error: error.message });
  }
};

// get alll companies
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await companyModel.find();

    res.status(200).json({
      success: true,
      data: companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Get filter companies
export const getCompanies = async (req, res) => {
  console.log(req.body);
  const { name, status } = req.body;

  try {
    // Build the filter criteria based on the provided company name and client status
    const filter = {};
    if (name) {
      filter["companyDetails.companyName"] = { $regex: name, $options: "i" }; // Case-insensitive match
    }
    if (status) {
      filter["companyDetails.clientStatus"] = status;
    }

    // Fetch companies based on the filter criteria
    const companies = await companyModel.find(filter);
    res.status(200).send(companies);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get a single company by ID
export const getCompanyById = async (req, res) => {
  try {
    const company = await companyModel.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.status(200).send(company);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Update a company by ID
export const updateCompany = async (req, res) => {
  try {
    const company = await companyModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.status(200).json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a company by ID
export const deleteCompany = async (req, res) => {
  try {
    const company = await companyModel.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.status(200).json({ message: "Company deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
