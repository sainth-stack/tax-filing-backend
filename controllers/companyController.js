// controllers/companyController.js

import companyModel from "../models/companyModel.js";

// Create a new company
export const createCompany = async (req, res) => {
  try {
    const company = new companyModel(req.body);
    await company.save();
    res.status(201).json(company);
  } catch (error) {
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
