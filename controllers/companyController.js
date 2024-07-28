// controllers/companyController.js

import fs from 'fs';
import companyModel from "../models/companyModel.js";
import { uploadFileToDrive } from '../middlewares/drive.js';
import path from 'path';



export const createCompany = async (req, res) => {
  try {

    const companyData = {
      ...req.body,
    };

    const company = new companyModel(companyData);
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(400).json({ error: error.message });
  }
};

export const uploadFiles = async (req, res) => {

  console.log(req.body); // Log the uploaded files
  try {
    const files = req.files; // Access the files from req.files
    const fileLinks = {};

    for (const file of files) {
      const fileName = file.filename; // File name on disk
      const filePath = path.join(file.destination, file.filename); // Full path to the file
      const uploadResponse = await uploadFileToDrive(filePath);
      fileLinks[file.fieldname] = uploadResponse.webViewLink;
      fs.unlinkSync(filePath); // Clean up temp file
    }

    console.log(fileLinks);

    const { companyId } = req.body;
    const company = await companyModel.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    company.attachements = {
      ...company.attachements,
      ...fileLinks
    };
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(400).json({ error: error.message });
  }
};


// Get all companies
export const getCompanies = async (req, res) => {
  try {
    const companies = await companyModel.find();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single company by ID
export const getCompanyById = async (req, res) => {
  try {
    const company = await companyModel.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
