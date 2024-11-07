// controllers/companyController.js

import fs from "fs";
import companyModel from "../models/companyModel.js";
import { uploadFileToDrive } from "../middlewares/drive.js";
import path from "path";
import mongoose from "mongoose";

import taskModel from '../models/AutoTaskModel.js';

// Default filing data template for tasks
const defaultFilingDataTemplate = [
  { taskId: "1", taskName: "gstMonthly", taskType: "gst", priority: "high", gstMonthly_gstType: 'gstr1' },
  { taskId: "2", taskName: "gstMonthly", taskType: "gst", priority: "high", gstMonthly_gstType: 'gstr3b' },
  { taskId: "3", taskName: "pfMonthly", taskType: "providentFund", priority: "high" },
  { taskId: "4", taskName: "tdsTcsMonthly", taskType: "tds", priority: "high" },
  { taskId: "5", taskName: "esiRegularMonthlyActivity", taskType: "esi", priority: "high" },
  { taskId: "6", taskName: "professionalTaxRegularMonthlyActivity", taskType: "professionalTax", priority: "high" },
];
// Create company controller
export const createCompany = async (req, res) => {
  try {
    const { companyDetails, ...remainingData } = req.body;
    const { companyName } = companyDetails; // Extract company name

    const existingCompany = await companyModel.findOne({
      "companyDetails.companyName": companyName,
    });

    if (existingCompany) {
      return res.status(400).json({ message: "Company already exists" });
    }

    const companyData = {
      companyDetails: {
        companyName,
        ...companyDetails,
      },
      ...remainingData,
    };

    const company = new companyModel(companyData);
    await company.save();

    // Create tasks for active services
    await createTasksForCompany(company?.companyDetails?.companyName, req.body);

    res.locals.companyId = company._id;
    res.send(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to create tasks for the new company based on active services
const createTasksForCompany = async (companyId, servicesData) => {
  try {
    const tasksToCreate = [];

    const createRecurringTasks = (serviceData, taskType) => {
      if (serviceData && serviceData.status === "active") {
        let effectiveDate = new Date(serviceData.effectiveFrom);
        const today = new Date();

        // Get all tasks of the specified taskType
        const tasksOfType = defaultFilingDataTemplate.filter(task => task.taskType === taskType);

        // Create a task for each month from effective date up to the current month
        while (effectiveDate <= today) {
          tasksOfType.forEach(taskTemplate => {
            tasksToCreate.push({
              ...taskTemplate,
              effectiveFrom: new Date(effectiveDate) // Clone effective date for this task
            });
          });

          effectiveDate.setMonth(effectiveDate.getMonth() + 1); // Move to the next month
        }
      }
    };

    // Check each service and create recurring tasks
    createRecurringTasks(servicesData.gst, "gst");
    createRecurringTasks(servicesData.esi, "esi");
    createRecurringTasks(servicesData.providentFund, "providentFund");
    createRecurringTasks(servicesData.tds, "tds");
    createRecurringTasks(servicesData.professionalTax, "professionalTax");

    // Map tasks and associate them with the company
    const tasks = tasksToCreate.map(task => {
      const startDate = new Date(task.effectiveFrom);
      const dueDate = new Date(startDate);
      dueDate.setDate(startDate.getDate() + 5); // Add 5 days to the start date

      return {
        ...task,
        company: companyId,
        startDate: task.effectiveFrom,
        dueDate: dueDate.toISOString(),
        status: 'pending'
      };
    });

    // Insert tasks into the task collection
    await taskModel.insertMany(tasks);
    console.log("Tasks created successfully for company ID:", companyId);
  } catch (error) {
    console.error("Error creating tasks:", error);
  }
};



/* file upload controller */
export const uploadFiles = async (req, res) => {
  try {
    /* getting files from input */
    const files = req.files;
    const fileLinks = {};

    const { companyId } = req.body;
    const company = await companyModel.findById(companyId);

    for (const file of files) {
      const fileName = file.filename; // File name on disk
      const filePath = path.join(file.destination, file.filename); // Full path to the file
      const uploadResponse = await uploadFileToDrive(filePath);
      const fields = file?.fieldname?.split(".");
      if (fields?.length > 1) {
        company[fields[0]][fields[1]] = uploadResponse?.url;
      } else {
        fileLinks[file.fieldname] = uploadResponse?.url;
        fs.unlinkSync(filePath);
      }
    }

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    company.attachments = {
      ...company.attachments,
      ...fileLinks,
    };
    await company.save();
    res.locals.companyId = company._id;

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
export const getFilterCompanies = async (req, res) => {
  const { name, status, year, month } = req.body;

  try {
    // Build the filter criteria based on the provided company name, client status, year, and month
    const filter = {};

    // Filter by company name (case-insensitive)
    if (name) {
      filter["companyDetails.companyName"] = { $regex: name, $options: "i" };
    }

    // Filter by client status
    if (status) {
      filter["companyDetails.clientStatus"] = status;
    }

    // Filter by year and month (if provided)
    if (year && month) {
      // Convert year and month into a start and end date
      const startOfMonth = new Date(`${year}-${month}-01`); // First day of the month
      const endOfMonth = new Date(year, month, 0); // Last day of the month

      // Handle effectiveFrom and effectiveTo based on conditions
      filter.$or = [
        // Case 1: Both effectiveFrom and effectiveTo exist
        {
          "companyDetails.effectiveFrom": {
            $exists: true,
            $lte: endOfMonth.toISOString(), // effectiveFrom is before or on the last day of the month
          },
          "companyDetails.effectiveTo": {
            $exists: true,
            $gte: startOfMonth.toISOString(), // effectiveTo is after or on the first day of the month
          },
        },
        // Case 2: Only effectiveFrom exists or effectiveTo is an empty string
        {
          "companyDetails.effectiveFrom": {
            $exists: true,
            $lte: endOfMonth.toISOString(), // effectiveFrom must be in or before the current month
          },
          $or: [
            { "companyDetails.effectiveTo": { $exists: false } }, // effectiveTo does not exist
            { "companyDetails.effectiveTo": "" }, // effectiveTo is an empty string
          ],
        },
      ];
    }

    // Fetch companies based on the filter criteria
    const companies = await companyModel.find(filter);
    res.status(200).send(companies);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    let company;
    if (isValidObjectId(id)) {
      // If id is a valid ObjectId, query by ObjectId
      company = await companyModel.findById(id);
    } else {
      // Otherwise, query by company name
      company = await companyModel.findOne({
        "companyDetails.companyName": id,
      });
    }

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
    const { id } = req.params;
    const { companyDetails, ...servicesData } = req.body;

    // Fetch the existing company data before updating
    const existingCompany = await companyModel.findById(id);
    if (!existingCompany) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Update the company information
    const updatedCompany = await companyModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    // Check each service and create tasks only if newly enabled
    const newlyEnabledServices = {};

    const checkAndAddService = (serviceKey) => {
      const currentService = servicesData[serviceKey];
      const previousService = existingCompany[serviceKey];

      if (
        currentService &&
        currentService.status === "active" &&
        (!previousService || previousService.status !== "active")
      ) {
        newlyEnabledServices[serviceKey] = currentService;
      }
    };

    // Add checks for each service
    checkAndAddService("gst");
    checkAndAddService("esi");
    checkAndAddService("providentFund");
    checkAndAddService("tds");
    checkAndAddService("professionalTax");

    // Only create tasks if there are newly enabled services
    if (Object.keys(newlyEnabledServices).length > 0) {
      await createTasksForCompany(updatedCompany?.companyDetails?.companyName, newlyEnabledServices);
    }

    res.locals.companyId = updatedCompany._id;
    res.status(200).json(updatedCompany);
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
    res.locals.companyId = company._id;
    res.status(200).json({ message: "Company deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//filter company by PAN
export const getCompanyByPan = async (req, res) => {
  try {
    const { pan } = req.params; // Extract PAN from the request parameters

    // Find the company by the PAN number within companyDetails
    const company = await companyModel.findOne({
      "companyDetails.pan": pan, // Correctly reference the PAN field
    });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.status(200).send(company);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
