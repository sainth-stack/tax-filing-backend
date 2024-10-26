// controllers/taskController.js
import { uploadFileToDrive } from "../middlewares/drive.js";
import Company from "../models/companyModel.js";
import User from "../models/employeeModel.js";
import taskModel from "./../models/taskModel.js";
import fs from "fs";
import path from "path";
import emailTemplates from "../templates/emailTemplates.js";
import sendEmail from "../middlewares/sendEmail.js";
import NotificationModel from "../models/NotificationModel.js";

export const createTask = async (req, res) => {
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
      const user = await User.findOne({ _id: assignedTo }).select("firstName email agency");
      if (user) {
        body.assignedName = user.firstName;

        // Fetch notification settings for the user's agency
        const notificationSettings = await NotificationModel.findOne({ agency: user.agency });
        // Check if the assignNewTask notification is enabled
        if (notificationSettings && notificationSettings.assignNewTask.status) {
          const subject = notificationSettings.assignNewTask.roleData.subject || emailTemplates.assignTask(taskName, user.firstName).subject;
          const bodyContent = notificationSettings.assignNewTask.roleData.message || emailTemplates.assignTask(taskName, user.firstName).body;

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

    const task = new taskModel(taskData);
    await task.save();

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
      task,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(400).json({ error: error.message });
  }
};
// get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await taskModel.find();

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getTasks = async (req, res) => {
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
  } = req.body;

  try {
    const filter = {};

    // Filter by company name using case-insensitive partial matching
    if (company) {
      filter.company = { $regex: company, $options: "i" };
    }

    // Date filtering logic for effectiveFrom and effectiveTo
    if (effectiveFrom && effectiveTo) {
      filter.startDate = { $gte: new Date(effectiveFrom) };
      filter.dueDate = { $lte: new Date(effectiveTo) };
    } else if (effectiveFrom) {
      filter.startDate = { $gte: new Date(effectiveFrom) };
    } else if (effectiveTo) {
      filter.dueDate = { $lte: new Date(effectiveTo) };
    }

    // Filter by assignedTo directly as a string
    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    // Filter by application sub-status
    if (applicationSubStatus) {
      filter.applicationSubStatus = applicationSubStatus;
    }

    // Filter by status
    if (status) {
      filter.applicationStatus = status;
    }

    // Filter by task type
    if (taskType) {
      filter.taskType = taskType;
    }

    // Year and Month Filtering based on getCompanies logic
    if (year && month) {
      // Convert year and month into start and end dates
      const startOfMonth = new Date(`${year}-${month}-01`); // First day of the month
      const endOfMonth = new Date(year, month, 0); // Last day of the month

      // Filter tasks where startDate is before the end of the month and dueDate is after the start of the month
      filter.startDate = {
        $lte: endOfMonth.toISOString(),
      };
      filter.dueDate = {
        $gte: startOfMonth.toISOString(),
      };
    } else if (year) {
      // Filter by entire year if only year is provided
      const startOfYear = new Date(`${year}-01-01`);
      const endOfYear = new Date(`${year}-12-31`);

      filter.startDate = {
        $lte: endOfYear.toISOString(),
      };
      filter.dueDate = {
        $gte: startOfYear.toISOString(),
      };
    }

    console.log("filter", filter);
    // Retrieve tasks based on the filter
    const tasks = await taskModel.find(filter);

    // Send the tasks in the response
    return res.status(200).send(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "An error occurred while fetching tasks." });
  }
};


// Get a single task by ID
export const getTaskById = async (req, res) => {
  try {
    // Find the task by ID and populate the 'company' field with the Company document
    const task = await taskModel.findById(req.params.id).populate("company");

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { body, files } = req;
    const file = files[0]; // Access the single file from req.files

    let fileLink = null;
    if (file) {
      const filePath = path.join(file.destination, file.filename); // Full path to the file
      const uploadResponse = await uploadFileToDrive(filePath);
      fileLink = uploadResponse.webViewLink;
      fs.unlinkSync(filePath); // Clean up temp file
    }

    // Fetch the existing task to check if 'assignedTo' has changed
    const existingTask = await taskModel.findById(req.params.id);

    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    const taskData = { ...body };
    if (fileLink) {
      taskData.attachment = fileLink;
    }

    // Update the task
    const updatedTask = await taskModel.findByIdAndUpdate(req.params.id, taskData, {
      new: true,
    });

    // Check if assignedTo is updated
    console.log(body.assignedTo)
    if (body.assignedTo && body.assignedTo !== existingTask.assignedTo) {
      // Fetch the new assigned user details
      const user = await User.findOne({ _id: body.assignedTo });
      console.log(user)
      if (user) {
        // Fetch notification settings for the user's agency
        const notificationSettings = await NotificationModel.findOne({ agency: user.agency });

        // Check if assignNewTask notification is enabled
        if (notificationSettings && notificationSettings.assignNewTask.status) {
          const subject = notificationSettings.assignNewTask.roleData.subject || emailTemplates.assignTask(updatedTask.taskName, user.firstName).subject;
          const bodyContent = notificationSettings.assignNewTask.roleData.message || emailTemplates.assignTask(updatedTask.taskName, user.firstName).body;

          // Send email notification to the new assignee
          sendEmail(user.email, subject, bodyContent);
        }
      }
    }

    // Update company GST status based on task fields
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

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(400).json({ error: error.message });
  }
};


// Delete a task by ID
export const deleteTask = async (req, res) => {
  try {
    const task = await taskModel.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadFiles = async (req, res) => {
  console.log(req.files); // Log the uploaded files
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

    const task = await taskModel.findById(req.body.taskId);
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
