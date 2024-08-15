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
    const file = files[0];
    console.log(file); // Access the single file from req.files
    let fileLink = null;
    if (file) {
      const filePath = path.join(file.destination, file.filename); // Full path to the file
      const uploadResponse = await uploadFileToDrive(filePath);
      fileLink = uploadResponse.webViewLink;
      fs.unlinkSync(filePath); // Clean up temp file
    }

    /* now do  */
    const user = await User.findById(body.assignedTo).select("firstName");
    if (!user) {
      return res.status(404).json({ error: "Assigned user not found" });
    }
    // Create the task object with the file link if available
    const taskData = {
      ...body,
      assignedName: user.firstName,
      attachment: fileLink || undefined,
    };

    // Save the task to the database
    const task = new taskModel(taskData);
    await task.save();

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

export const getTasks = async (req, res) => {
  const {
    company,
    effectiveFrom,
    effectiveTo,
    assignedTo,
    status,
    applicationSubStatus,
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
