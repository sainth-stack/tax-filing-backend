// controllers/taskController.js
import { uploadFileToDrive } from "../middlewares/drive.js";
import Company from "../models/companyModel.js";
import User from "../models/employeeModel.js";
import AutoTaskModel from "./../models/AutoTaskModel.js";
import fs from "fs";
import path from "path";
import emailTemplates from "../templates/emailTemplates.js";
import sendEmail from "../middlewares/sendEmail.js";
import NotificationModel from "../models/NotificationModel.js";
import json2csv from "json2csv"; // Import json2csv for converting JSON to CSV
import { CreatePaymentTask } from "../helpers/createPaymentTask.js";

export const createAutoTask = async (req, res) => {
  try {
    const { body, files } = req;
    const fileLinks = {};

    // Handle file uploads
    for (const file of files) {
      const filePath = path.join(file.destination, file.filename); // Full path to the file
      const uploadResponse = await uploadFileToDrive(filePath);
      fileLinks[file.fieldname] = uploadResponse?.url;
      fs.unlinkSync(filePath); // Clean up temp file
    }

    const { assignedTo, taskName } = body;

    if (assignedTo) {
      // Fetch user based on the assignedTo string (assuming it is some identifier)
      const user = await User.findOne({ _id: assignedTo }).select(
        "firstName email agency"
      );
      if (user) {
        body.assignedName = user.firstName + " " + (user?.lastName || "");

        // Fetch notification settings for the user's agency
        const notificationSettings = await NotificationModel.findOne({
          agency: user.agency,
        });
        // Check if the assignNewTask notification is enabled
        if (notificationSettings && notificationSettings.assignNewTask.status) {
          const subject =
            notificationSettings.assignNewTask.roleData.subject ||
            emailTemplates.assignTask(taskName, user.firstName).subject;
          const bodyContent =
            notificationSettings.assignNewTask.roleData.message ||
            emailTemplates.assignTask(taskName, user.firstName).body;

          // Send email to the assigned user
          sendEmail(user.email, subject, bodyContent);
        }
      } else {
        body.assignedName = ""; // or some default value
      }
    } else {
      body.assignedName = "";
    }

    // Prepare task data
    const taskData = {
      ...body,
      ...fileLinks,
    };

    const AutoTask = await AutoTaskModel.create(taskData);
    await AutoTask.save();

    // Update company GST status and approvalCertificate based on task fields
    const updateData = {};

    if (body.dateOfApproval) {
      updateData["gst.status"] =
        body.taskName === "gstNewRegistration" ? "active" : "inactive";
    }

    if (fileLinks.approvalCertificate) {
      updateData["gst.approvalCertificate"] = fileLinks.approvalCertificate;
    }

    if (Object.keys(updateData).length > 0) {
      await Company.findOneAndUpdate(
        { "companyDetails.companyName": body.company }, // Query to find the document
        { $set: updateData }, // Update operation
        { new: true } // Option to return the updated document
      );
    }

    return res.status(201).send({
      success: true,
      message: "Task created successfully",
      AutoTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(400).json({ error: error.message });
  }
};

export const getAllAutoTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page); // Default to page 1 if not provided
    const pageSize = parseInt(req.query.pageSize); // Default to 10 tasks per page if not provided

    let tasks;
    let totalTasks;

    if (page && pageSize) {
      const skips = (page - 1) * pageSize;
      tasks = await AutoTaskModel.find().skip(skips).limit(pageSize);
      totalTasks = await AutoTaskModel.countDocuments(); // Get total count of tasks
    } else {
      // If pagination values are not provided, return all tasks
      tasks = await AutoTaskModel.find();
      totalTasks = tasks.length; // Return the total number of tasks in this case
    }

    res.status(200).json({
      success: true,
      data: tasks,
      totalTasks,
      totalPages: pageSize ? Math.ceil(totalTasks / pageSize) : 1, // Calculate total pages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getAutoTasks = async (req, res) => {
  const {
    company,
    effectiveFrom,
    effectiveTo,
    assignedTo,
    status,
    applicationSubStatus,
    taskType,
    year,
    month,
    user,
    list,
    page,
    pageSize,
    reason,
    agency,
  } = req.body;

  try {
    const filter = {};

    // Filter by user list (if provided)
    if (list) {
      const userRecord = await User.findById(list).lean().exec();
      if (!userRecord) {
        return res.status(404).json({ error: "User not found" });
      }
      const userCompanies =
        userRecord.company?.map((comp) => comp?.label) || [];
      filter.company = { $in: userCompanies };

      filter.$or = [
        { assignedTo: list },
        { assignedTo: "" },
        { assignedTo: null },
        { assignedTo: { $exists: false } },
      ];
    }

    // Filter by company
    if (company) {
      const escapedCompany = company.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.company = filter.company
        ? { $in: filter.company.$in, $regex: escapedCompany, $options: "i" }
        : { $regex: escapedCompany, $options: "i" };
    }

    // Filter by reason
    if (reason) {
      filter.gstMonthly_previousMonth = { $regex: reason, $options: "i" };
    }

    // Date range filters (effectiveFrom, effectiveTo)
    if (effectiveFrom && effectiveTo) {
      filter.startDate = { $gte: new Date(effectiveFrom) };
      filter.dueDate = { $lte: new Date(effectiveTo) };
    } else if (effectiveFrom) {
      filter.startDate = { $gte: new Date(effectiveFrom) };
    } else if (effectiveTo) {
      filter.dueDate = { $lte: new Date(effectiveTo) };
    }

    // Filter by assignedTo
    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    // Filter by agency
    if (agency) {
      filter.agencyName = { $regex: agency, $options: "i" };
    }

    // Filter by applicationSubStatus (gstr3b or gstr1)
    if (applicationSubStatus === "gstr3b" || applicationSubStatus === "gstr1") {
      filter.gstMonthly_gstType = applicationSubStatus;
    } else if (applicationSubStatus) {
      filter.taskName = applicationSubStatus;
    }

    if (status === "filed") {
      filter.$and = [
        {
          $or: [
            { taskType: "gst", gstMonthly_filedate: { $exists: true, $ne: null, $ne: "" } },
            { taskType: "providentFund", pfMonthly_filedate: { $exists: true, $ne: null, $ne: "" } },
            { taskType: "esi", esi_fileDate: { $exists: true, $ne: null, $ne: "" } },
            { taskType: "professionalTax", pft_fileDate: { $exists: true, $ne: null, $ne: "" } },
            { taskType: "incomeTax", tax_filingDate: { $exists: true, $ne: null, $ne: "" } },
            { taskType: "tds", tdsmonthly_fileDate: { $exists: true, $ne: null, $ne: "" } }
          ]
        }
      ];
    } else if (status === "notFiled") {
      filter.$and = [
        {
          $or: [
            { taskType: "gst", gstMonthly_filedate: { $in: [null, "", undefined] } },
            { taskType: "providentFund", pfMonthly_filedate: { $in: [null, "", undefined] } },
            { taskType: "esi", esi_fileDate: { $in: [null, "", undefined] } },
            { taskType: "professionalTax", pft_fileDate: { $in: [null, "", undefined] } },
            { taskType: "incomeTax", tax_filingDate: { $in: [null, "", undefined] } },
            { taskType: "tds", tdsmonthly_fileDate: { $in: [null, "", undefined] } }
          ]
        }
      ];
    }
    // Filter by taskType
    if (taskType) {
      filter.taskType = taskType;
    }

    if (year && month) {
      const startDate = new Date(Date.UTC(year, month, 1));
      const nextYear = (parseInt(month) + 1) > 12 ? (parseInt(year) + 1) : parseInt(year);
      const nextMonth = (parseInt(month) + 1) > 12 ? 1 : (parseInt(month) + 1);
      const endDate = new Date(Date.UTC(nextYear, nextMonth, 1));
      endDate.setUTCDate(endDate.getUTCDate() - 1);
      
      // Validate dates
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          throw new Error("Invalid date range for year and month.");
      }
  
      filter.startDate = {
          $gte: startDate.toISOString(),
          $lte: endDate.toISOString(),
      };
  } else if (year) {
      // Handle multiple years (comma-separated)
      const years = year.split(',').map(y => parseInt(y.trim())); // Split and trim years
  
      // Validate years
      if (years.some(y => isNaN(y) || y < 0)) {
          throw new Error("Invalid year value(s).");
      }
  
      const dateRanges = years.map(y => {
          const startOfYear = new Date(`${y}-02-01`); // Starting from February 1st
          const endOfYear = new Date(`${y}-02-01`);
          endOfYear.setFullYear(endOfYear.getFullYear() + 1); // End of the year is January 1st of the next year
  
          // Validate dates
          if (isNaN(startOfYear.getTime()) || isNaN(endOfYear.getTime())) {
              throw new Error(`Invalid date range for year: ${y}`);
          }
  
          return { startOfYear, endOfYear };
      });
      // Combine date ranges for multiple years
      filter.$or = dateRanges.map(range => ({
          startDate: {
              $gte: range.startOfYear.toISOString(),
              $lte: range.endOfYear.toISOString(),
          },
      }));
  }
    // Retrieve tasks based on the filter with pagination
    let AutoTasks;
    let totalTasks;

    if (page && pageSize) {
      const skip = (page - 1) * pageSize;
      AutoTasks = await AutoTaskModel.find(filter).skip(skip).limit(pageSize);
      totalTasks = await AutoTaskModel.countDocuments(filter);
    } else {
      AutoTasks = await AutoTaskModel.find(filter);
      totalTasks = AutoTasks.length;
    }

    // Respond with the tasks and pagination info
    return res.status(200).json({
      tasks: AutoTasks,
      totalTasks,
      totalPages: pageSize ? Math.ceil(totalTasks / pageSize) : 1,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "An error occurred while fetching tasks." });
  }
};


export const getAutoTaskById = async (req, res) => {
  try {
    // Find the task by ID and populate the 'company' field with the Company document
    const AutoTask = await AutoTaskModel.findById(req.params.id).populate(
      "company"
    );

    if (!AutoTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(AutoTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAutoTask = async (req, res) => {
  try {
    const { body } = req;
    const files = req.files; // Access the multiple files from req.files

    let fileLinks = {}; // Object to store file URLs

    // Handle file uploads
    for (const file of files) {
      const filePath = path.join(file.destination, file.filename); // Full path to the file
      const uploadResponse = await uploadFileToDrive(filePath);

      if (uploadResponse && uploadResponse.url) {
        fileLinks[file.fieldname] = uploadResponse.url; // Store the file URL using the field name
      }

      fs.unlinkSync(filePath); // Clean up temp file
    }
    // Fetch the existing task to check if 'assignedTo' has changed
    const existingAutoTask = await AutoTaskModel.findById(req.params.id);

    if (!existingAutoTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    const AutoTaskData = { ...body };
    if (fileLinks.attachment) {
      AutoTaskData.attachment = fileLinks.attachment;
    }

    if (fileLinks?.acknowledgement) {
      AutoTaskData.acknowledgement = fileLinks?.acknowledgement;
    }

    if (fileLinks?.challan) {
      AutoTaskData.challan = fileLinks?.challan;
    }

    if (body.assignedTo && body.assignedTo !== existingAutoTask.assignedTo) {
      // Fetch the new assigned user details
      const user = await User.findOne({ _id: body.assignedTo });
      if (user) {
        AutoTaskData.assignedName =
          user.firstName + " " + (user?.lastName || "");
        // Fetch notification settings for the user's agency
        const notificationSettings = await NotificationModel.findOne({
          agency: user.agency,
        });

        // Check if assignNewTask notification is enabled
        if (notificationSettings && notificationSettings.assignNewTask.status) {
          const subject =
            notificationSettings.assignNewTask.roleData.subject ||
            emailTemplates.assignTask(updatedTask.taskName, user.firstName)
              .subject;
          const bodyContent =
            notificationSettings.assignNewTask.roleData.message ||
            emailTemplates.assignTask(updatedTask.taskName, user.firstName)
              .body;

          // Send email notification to the new assignee
          sendEmail(user.email, subject, bodyContent);
        }
      }
    }

    if (body.dateOfApproval) {
      await Company.findOneAndUpdate(
        { "companyDetails.companyName": body.company }, // Query to find the document
        {
          $set: {
            "gst.status":
              body.taskName === "gstNewRegistration" ? "active" : "inactive",
          },
        }, // Update operation
        { new: true } // Option to return the updated document
      );
    }

    if (body.appealFileReturnStatus) {
      await Company.findOneAndUpdate(
        { "companyDetails.companyName": body.company },
        { $set: { "gst.status": "inactive" } }, // Update operation
        { new: true } // Option to return the updated document
      );
    }

    const updatedAutoTask = await AutoTaskModel.findByIdAndUpdate(
      req.params.id,
      AutoTaskData,
      {
        new: true,
      }
    );

    await CreatePaymentTask({...AutoTaskData,id:req.params.id})

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedAutoTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteAutoTask = async (req, res) => {
  try {
    const AutoTask = await AutoTaskModel.findByIdAndDelete(req.params.id);
    if (!AutoTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadFiles = async (req, res) => {
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

    const task = await AutoTaskModel.findById(req.body.taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    task.attachments = {
      ...task.attachments,
      ...fileLinks,
    };
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(400).json({ error: error.message });
  }
};

// New API endpoint for exporting tasks
export const exportAutoTasks = async (req, res) => {
  try {
    const tasks = await AutoTaskModel.find({}).select(
      "company startDate taskName taskType gstMonthly_gstType dueDate applicationStatus assignedName applicationSubStatus"
    ); // Fetch only the specified fields
    const csv = json2csv.parse(tasks.map((task) => task.toObject())); // Convert Mongoose documents to plain objects

    res.header("Content-Type", "text/csv");
    res.attachment("auto_tasks.csv"); // Set the file name for download
    res.send(csv); // Send the CSV file
  } catch (error) {
    console.error("Error exporting tasks:", error);
    res.status(500).json({ error: "An error occurred while exporting tasks." });
  }
};
