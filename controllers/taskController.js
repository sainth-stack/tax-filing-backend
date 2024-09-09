// controllers/taskController.js
import { uploadFileToDrive } from "../middlewares/drive.js";
import Company from "../models/companyModel.js";
import User from "../models/employeeModel.js";
import taskModel from "./../models/taskModel.js";
import fs from "fs";
import path from "path";


export const createTask = async (req, res) => {
  try {
    const { body, files } = req;
    const fileLinks = {};

    for (const file of files) {
      const fileName = file.filename; // File name on disk
      const filePath = path.join(file.destination, file.filename); // Full path to the file
      const uploadResponse = await uploadFileToDrive(filePath);
      fileLinks[file.fieldname] = uploadResponse?.url;
      fs.unlinkSync(filePath); // Clean up temp file
    }
    const { assignedTo } = body;

    // Check if assignedTo is provided and is a non-empty string
    if (assignedTo && typeof assignedTo === 'string') {
      // Fetch user based on the assignedTo string (assuming it is some identifier)
      const user = await User.findOne({ someField: assignedTo }).select("firstName");
      
      if (user) {
        body.assignedName = user.firstName;
      } else {
        // Handle case where user is not found if needed
        // e.g., set assignedName to a default value or log a warning
        body.assignedName = ''; // or some default value
      }
    } else {
      // Handle cases where assignedTo is not provided or is invalid
      body.assignedName = ''; // or some default value
    }
    
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
    taskType
  } = req.body;

  try {
    const filter = {};

    // Filter by company name using case-insensitive partial matching
    if (company) {
      filter.company = { $regex: company, $options: "i" };
    }

    // Date filtering logic for startDate and dueDate
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
    if (taskType) {
      filter.taskType = taskType
    }
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
    const task = await taskModel.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a task by ID
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

    // Update the task object with the file link if available
    const taskData = { ...body };
    if (fileLink) {
      taskData.attachment = fileLink;
    }

    const task = await taskModel.findByIdAndUpdate(req.params.id, taskData, {
      new: true,
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Update company GST status based on task fields
    if (body.dateOfApproval) {
      await Company.findOneAndUpdate(
        { "companyDetails.companyName": body.company }, // Query to find the document
        {
          $set: {
            "gst.status":
              body.taskName == "gstNewRegistration" ? "active" : "inactive",
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
      task,
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
