// controllers/companyController.js

import fs from "fs";
import companyModel from "../models/companyModel.js";
import { uploadFileToDrive } from "../middlewares/drive.js";
import path from "path";
import mongoose from "mongoose";

import taskModel from "../models/AutoTaskModel.js";
import maualTaskModel from "../models/taskModel.js";

import ServiceCalendarModel from "../models/ServiceCalendar.js";
import UserModel from "../models/employeeModel.js";

const defaultFilingDataTemplate = [
  {
    taskId: "gstMonthly-gstr1",
    taskName: "gstMonthly",
    taskType: "gst",
    priority: "high",
    gstMonthly_gstType: "gstr1",
  },
  {
    taskId: "gstMonthly-gstr3b",
    taskName: "gstMonthly",
    taskType: "gst",
    priority: "high",
    gstMonthly_gstType: "gstr3b",
  },
  {
    taskId: "pfMonthly",
    taskName: "pfMonthly",
    taskType: "providentFund",
    priority: "high",
  },
  {
    taskId: "tdsTcsMonthly",
    taskName: "tdsTcsMonthly",
    taskType: "tds",
    priority: "high",
  },
  {
    taskId: "esiRegularMonthlyActivity",
    taskName: "esiRegularMonthlyActivity",
    taskType: "esi",
    priority: "high",
  },
  {
    taskId: "professionalTaxRegularMonthlyActivity",
    taskName: "professionalTaxRegularMonthlyActivity",
    taskType: "professionalTax",
    priority: "high",
  },
];

export const createCompany = async (req, res) => {
  try {
    const { companyDetails, ...remainingData } = req.body;

    // Define required fields and their display names
    const fieldDisplayNames = {
      companyName: "Company Name",
      mailId: "Email",
      pan: "PAN",
    };
    const requiredFields = ["companyName", "mailId", "pan"];
    const missingFields = requiredFields.filter(
      (field) => !companyDetails?.[field]
    );
    if (missingFields.length > 0) {
      const missingFieldNames = missingFields.map(
        (field) => fieldDisplayNames[field]
      );
      return res.status(400).json({
        message: `Missing Required Fields: ${missingFieldNames.join(", ")}`,
      });
    }

    const { companyName, pan, agencyName } = companyDetails;

    // Check if a company with the same PAN already exists
    const existingCompany = await companyModel.findOne({
      "companyDetails.pan": pan,
    });

    if (existingCompany) {
      return res.status(400).json({ message: "PAN already exists." });
    }

    // Prepare sections that allow duplicates as arrays
    // const sectionsAllowingDuplicates = [
    //   "gst",
    //   "professionalTax",
    //   "fssai",
    //   "shopCommercialEstablishment",
    //   "factoryLicense",
    // ];

    /*  sectionsAllowingDuplicates.forEach((section) => {
      if (remainingData[section]) {
     
        if (!Array.isArray(remainingData[section])) {
          remainingData[section] = [remainingData[section]];
        }
      }
    }); */

    // Prepare the company data
    const companyData = {
      companyDetails: {
        companyName,
        ...companyDetails,
      },
      ...remainingData,
    };

    // Save the company
    const company = new companyModel(companyData);
    await company.save();

    // Create tasks for active services
    await createTasksForCompany(
      company?.companyDetails?.companyName,
      req.body,
      agencyName
    );

    res.locals.companyId = company._id;
    res.send(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createTasksForCompany = async (companyId, servicesData, agencyName) => {
  try {
    // Fetch all service tasks
    const serviceTasks = await ServiceCalendarModel.find({});
    const tasksToCreate = [];

    const createOrUpdateRecurringTasks = async (serviceData, taskType) => {
      if (serviceData && serviceData.status === "active") {
        let effectiveDate = new Date(serviceData.effectiveFrom);
        let effectiveTo = serviceData.effectiveTo
          ? new Date(serviceData.effectiveTo)
          : new Date();

        effectiveDate.setMonth(effectiveDate.getMonth() + 1);
        if (serviceData.effectiveTo) {
          effectiveTo.setMonth(effectiveTo.getMonth() + 1);
        }
        const tasksOfType = defaultFilingDataTemplate.filter(
          (task) => task.taskType === taskType
        );
        const deletedTasks = await taskModel.deleteMany({
          company: companyId,
          $or: [
            { startDate: { $lt: effectiveDate } }, // Before effectiveDate
            { startDate: { $gt: effectiveTo } }, // After effectiveTo
          ],
        });

        console.log(`Deleted tasks:`, deletedTasks.deletedCount);

        while (effectiveDate <= effectiveTo) {
          const currentMonthStart = new Date(
            effectiveDate.getFullYear(),
            effectiveDate.getMonth(),
            1
          );
          const nextMonthStart = new Date(
            effectiveDate.getFullYear(),
            effectiveDate.getMonth() + 1,
            1
          );

          for (const taskTemplate of tasksOfType) {
            const matchingServiceTask = serviceTasks.find(
              (task) => task.taskId === taskTemplate.taskId
            );
            let dueDate = matchingServiceTask
              ? new Date(matchingServiceTask.date)
              : null;

            if (dueDate) {
              dueDate = new Date(
                effectiveDate.getFullYear(),
                effectiveDate.getMonth(),
                dueDate.getDate()
              );
            }

            const existingTask = await taskModel.findOne({
              company: companyId,
              taskName: taskTemplate?.taskId.split("-")[0],
              gstMonthly_gstType:
                taskTemplate.taskId.split("-")?.length > 1
                  ? taskTemplate.taskId.split("-")[1]
                  : "",
              startDate: {
                $gte: currentMonthStart,
                $lt: nextMonthStart,
              },
            });

            if (!existingTask) {
              const taskEffectiveDate = new Date(effectiveDate);

              tasksToCreate.push({
                ...taskTemplate,
                effectiveFrom: taskEffectiveDate,
                dueDate: dueDate,
                agencyName: agencyName,
              });
            }
          }

          effectiveDate.setMonth(effectiveDate.getMonth() + 1);
        }
      }
    };

    // Check each service and create/update recurring tasks
    await createOrUpdateRecurringTasks(servicesData.gst, "gst");
    await createOrUpdateRecurringTasks(servicesData.esi, "esi");
    await createOrUpdateRecurringTasks(
      servicesData.providentFund,
      "providentFund"
    );
    await createOrUpdateRecurringTasks(servicesData.tds, "tds");
    await createOrUpdateRecurringTasks(
      servicesData.professionalTax,
      "professionalTax"
    );

    // Map tasks and associate them with the company
    const tasks = tasksToCreate.map((task) => {
      const startDate = new Date(task.effectiveFrom);
      const dueDate =
        task.dueDate || new Date(startDate.setDate(startDate.getDate() + 5));

      return {
        ...task,
        company: companyId,
        startDate: task.effectiveFrom,
        dueDate: dueDate.toISOString(),
        status: "pending",
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
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    const updates = {};

    for (const file of files) {
      const fileName = file.filename;
      const filePath = path.join(file.destination, file.filename); 
      const uploadResponse = await uploadFileToDrive(filePath);

      const fields = file?.fieldname?.split(".");
      if (fields?.length > 1) {
        updates[`${fields[0]}.${fields[1]}`] = uploadResponse?.url;
      } else {
        fileLinks[file.fieldname] = uploadResponse?.url;
        fs.unlinkSync(filePath);
      }
    }

    updates.attachments = {
      ...company.attachments,
      ...fileLinks,
    };

    await companyModel.updateOne({ _id: companyId }, { $set: updates });

    res.locals.companyId = companyId;
    const updatedCompany = await companyModel.findById(companyId);
    res.status(201).json(updatedCompany);
  } catch (error) {
    console.error("Error creating company:", error);
    res.status(400).json({ error: error.message });
  }
};

// get alll companies
export const getAllCompanies = async (req, res) => {
  try {
    const page = parseInt(req.query.page); // Default to page 1
    const pageSize = parseInt(req.query.pageSize); // Default to 10 items per page
    const agency = req.query.agency; // Default to 10 items per page
    // console.log("page : ", page)
    // console.log("pagesize",pageSize)
    // Calculate the number of items to skip
    const skip = (page - 1) * pageSize;
    const filter = {
      $and: []
    };
    
    if (agency) {
      // console.log(agency);
      filter.$and.push({
        "companyDetails.agencyName": {
          $regex: new RegExp(agency, "i"), // Case-insensitive regex
        },
      });
    }
    
    // If no filters are apcplied, remove the $and key to avoid an unnecessary empty condition
    if (filter.$and.length === 0) {
      delete filter.$and;
    }
        
    const companies = await companyModel.find(filter).skip(skip).limit(pageSize);
    const totalCompanies = await companyModel.countDocuments();

    res.status(200).json({
      success: true,
      data: companies,
      page,
      pageSize,
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
  const {
    name,
    status,
    year,
    month,
    userId,
    taskType,
    page,
    pageSize,
    agency,
  } = req.body;

  try {
    const filter = {};

    // Check if userId is provided
    if (userId) {
      const userRecord = await UserModel.findById(userId).lean().exec();
      if (!userRecord) {
        return res.status(404).json({ error: "User not found" });
      }
      const userCompanyIds = userRecord?.company?.map((comp) => comp._id) || [];
      filter._id = { $in: userCompanyIds };
    }

    // Build filter for company name
    if (name) {
      const trimmedCompanyName = name.trim();
      const escapedCompany = trimmedCompanyName.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );
      filter.$and = filter.$and || [];
      filter.$and.push({
        "companyDetails.companyName": {
          $regex: new RegExp(escapedCompany, "i"),
        },
      });
    }

    // Build filter for agency
    if (agency) {
      filter.$and = filter.$and || [];
      filter.$and.push({
        "companyDetails.agencyName": {
          $regex: new RegExp(agency, "i"),
        },
      });
    }

    // Build filter for status
    if (status) {
      filter.$and.push({ "companyDetails.clientStatus": status });
    }

    // Build filter for task type
    if (taskType) {
      filter[`${taskType}.status`] = "active";
    }

    // Handle year and month filtering
    if (year && month) {
      const yearValue = year;
      const monthValue = parseInt(month, 10);

      if (isNaN(yearValue) || monthValue < 1 || monthValue > 12) {
        throw new Error("Invalid year or month");
      }

      const startOfMonth = new Date(
        `${yearValue}-${monthValue.toString().padStart(2, "0")}-01`
      );
      const endOfMonth = new Date(yearValue, monthValue, 0);

      // Ensure dates are valid
      if (isNaN(startOfMonth.getTime()) || isNaN(endOfMonth.getTime())) {
        throw new Error("Invalid start or end of month date.");
      }

      filter.$and = filter.$and || [];
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
        ],
      });
    } else if (year) {
      const years = Array.isArray(year)
        ? year.map((y) => y.value)
        : [year.value];

      if (years.length > 0) {
        filter.$or = years.map((yr) => {
          const startOfYear = new Date(`${yr}-01-01`);
          const endOfYear = new Date(`${yr}-12-31`);

          if (isNaN(startOfYear.getTime()) || isNaN(endOfYear.getTime())) {
            throw new Error("Invalid year date.");
          }

          return {
            $and: [
              {
                "companyDetails.effectiveFrom": {
                  $lte: endOfYear.toISOString(),
                },
              },
              {
                $or: [
                  { "companyDetails.effectiveTo": { $exists: false } },
                  {
                    "companyDetails.effectiveTo": {
                      $gte: startOfYear.toISOString(),
                    },
                  },
                ],
              },
            ],
          };
        });
      }
    }

    // Pagination logic
    let companies;
    let totalCount = 0;

    if (page && pageSize) {
      const currentPage = parseInt(page, 10);
      const currentPageSize = parseInt(pageSize, 10);

      const skip = (currentPage - 1) * currentPageSize;

      companies = await companyModel
        .find(filter)
        .skip(skip)
        .limit(currentPageSize)
        .exec();

      totalCount = await companyModel.countDocuments(filter);
    } else {
      companies = await companyModel.find(filter).exec();
      totalCount = companies.length;
    }

    // Return the result
    res.status(200).json({
      data: companies,
      totalCount,
      totalPages: pageSize ? Math.ceil(totalCount / pageSize) : 1,
    });
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

      if (currentService && currentService.status === "active") {
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
      await createTasksForCompany(
        updatedCompany?.companyDetails?.companyName,
        newlyEnabledServices,
        updatedCompany?.companyDetails?.agencyName
      );
    }

    res.locals.companyId = updatedCompany._id;
    res.status(200).json(updatedCompany);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    // Check if the company exists
    const company = await companyModel.findById(id);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Check for tasks associated with the company name
    const associatedTasks = await taskModel.find({
      company: company?.companyDetails?.companyName,
    });
    if (associatedTasks.length > 0) {
      return res.status(400).json({
        error: "Please delete all associated tasks before deleting the company",
        tasks: associatedTasks,
      });
    }

    await companyModel.findByIdAndDelete(id);
    res.locals.companyId = id;
    res.status(200).json({ message: "Company deleted successfully" });
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
