// controllers/companyController.js

import fs from "fs";
import companyModel from "../models/companyModel.js";
import { uploadFileToDrive } from "../middlewares/drive.js";
import path from "path";
import mongoose from "mongoose";

import taskModel from '../models/AutoTaskModel.js';
import ServiceCalendarModel from "../models/ServiceCalendar.js";
import UserModel from "../models/employeeModel.js";

const defaultFilingDataTemplate = [
  { taskId: "gstMonthly-gstr1", taskName: "gstMonthly", taskType: "gst", priority: "high", gstMonthly_gstType: 'gstr1' },
  { taskId: "gstMonthly-gstr3b", taskName: "gstMonthly", taskType: "gst", priority: "high", gstMonthly_gstType: 'gstr3b' },
  { taskId: "pfMonthly", taskName: "pfMonthly", taskType: "providentFund", priority: "high" },
  { taskId: "tdsTcsMonthly", taskName: "tdsTcsMonthly", taskType: "tds", priority: "high" },
  { taskId: "esiRegularMonthlyActivity", taskName: "esiRegularMonthlyActivity", taskType: "esi", priority: "high" },
  { taskId: "professionalTaxRegularMonthlyActivity", taskName: "professionalTaxRegularMonthlyActivity", taskType: "professionalTax", priority: "high" },
];
export const createCompany = async (req, res) => {
  try {
    const { companyDetails, ...remainingData } = req.body;
    const { companyName, pan } = companyDetails; // Extract company name

    const existingCompany = await companyModel.findOne({
      "companyDetails.pan": pan,
    });

    if (existingCompany) {
      return res.status(400).json({ message: "Pan already exists" });
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

const createTasksForCompany = async (companyId, servicesData) => {
  try {
    // Fetch all service tasks
    const serviceTasks = await ServiceCalendarModel.find({});
    const tasksToCreate = [];

    const createRecurringTasks = async (serviceData, taskType) => {
      if (serviceData && serviceData.status === "active") {
        let effectiveDate = new Date(serviceData.effectiveFrom);
        const today = new Date();

        const tasksOfType = defaultFilingDataTemplate.filter(task => task.taskType === taskType);

        while (effectiveDate <= today) {
          const currentMonthStart = new Date(effectiveDate.getFullYear(), effectiveDate.getMonth(), 1);
          const nextMonthStart = new Date(effectiveDate.getFullYear(), effectiveDate.getMonth() + 1, 1);

          for (const taskTemplate of tasksOfType) {
            const matchingServiceTask = serviceTasks.find(task => task.taskId === taskTemplate.taskId);
            let dueDate = matchingServiceTask ? new Date(matchingServiceTask.date) : null;

            if (dueDate) {
              dueDate = new Date(effectiveDate.getFullYear(), effectiveDate.getMonth(), dueDate.getDate());
            }

            const existingTask = await taskModel.findOne({
              company: companyId,
              taskName: taskTemplate?.taskId.split('-')[0],
              gstMonthly_gstType: taskTemplate.taskId.split('-')?.length > 1 ? taskTemplate.taskId.split('-')[1] : '',
              startDate: {
                $gte: currentMonthStart,
                $lt: nextMonthStart,
              }
            });

            if (!existingTask) {
              const taskEffectiveDate = new Date(effectiveDate);

              tasksToCreate.push({
                ...taskTemplate,
                effectiveFrom: taskEffectiveDate,
                dueDate: dueDate
              });
            }
          }

          effectiveDate.setMonth(effectiveDate.getMonth() + 1);
        }
      }
    };

    // Check each service and create recurring tasks
    await createRecurringTasks(servicesData.gst, "gst");
    await createRecurringTasks(servicesData.esi, "esi");
    await createRecurringTasks(servicesData.providentFund, "providentFund");
    await createRecurringTasks(servicesData.tds, "tds");
    await createRecurringTasks(servicesData.professionalTax, "professionalTax");

    // Map tasks and associate them with the company
    const tasks = tasksToCreate.map(task => {
      const startDate = new Date(task.effectiveFrom);
      const dueDate = task.dueDate || new Date(startDate.setDate(startDate.getDate() + 5));

      return {
        ...task,
        company: companyId,
        startDate: task.effectiveFrom,
        dueDate: dueDate.toISOString(),
        status: 'pending'
      };
    });

    // Insert tasks into the task collection only if there are tasks to create
    if (tasks.length > 0) {
      await taskModel.insertMany(tasks);
    }
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
  const { name, status, year, month, userId, taskType } = req.body;

  try {
    // Build the filter criteria
    const filter = {};
    if (name || status || (year && month)) {
      filter.$and = [];
    }

    // Only get user's companies if userId is provided
    if (userId) {
      const userRecord = await UserModel.findById(userId).lean().exec();
      if (!userRecord) {
        return res.status(404).json({ error: "User not found" });
      }
      const userCompanyIds = userRecord.company?.map(comp => comp._id) || [];
      filter._id = { $in: userCompanyIds };
    }

    // Add additional filters
    if (name) {
      filter.$and.push({ "companyDetails.companyName": { $regex: name, $options: "i" } });
    }

    if (status) {
      filter.$and.push({ "companyDetails.clientStatus": status });
    }

    if (taskType) {
      console.log(taskType, 'taskType')
      filter[`${taskType}.status`] = "active";
    }

    if (year && month) {
      const startOfMonth = new Date(`${year}-${month}-01`);
      const endOfMonth = new Date(year, month, 0);

      filter.$and.push({
        $or: [
          {
            "companyDetails.effectiveFrom": {
              $exists: true,
              $lte: endOfMonth.toISOString(),
            },
            "companyDetails.effectiveTo": {
              $exists: true,
              $gte: startOfMonth.toISOString(),
            },
          },
          {
            "companyDetails.effectiveFrom": {
              $exists: true,
              $lte: endOfMonth.toISOString(),
            },
            $or: [
              { "companyDetails.effectiveTo": { $exists: false } },
              { "companyDetails.effectiveTo": "" },
            ],
          },
        ]
      });
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
        currentService.status === "active") {
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
