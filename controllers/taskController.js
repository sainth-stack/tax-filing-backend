// controllers/taskController.js
import { uploadFileToDrive } from "../middlewares/drive.js";
import Company from "../models/companyModel.js";
import taskModel from "./../models/taskModel.js";
import fs from "fs";

export const getTasks = async (req, res) => {
  const { company, effectiveFrom, effectiveTo, assignedTo, status } = req.body;

  try {
    const filter = {};

    if (company) {
      filter.company = { $regex: company, $options: "i" };
    }

    if (effectiveFrom && effectiveTo) {
      filter.startDate = { $gte: new Date(effectiveFrom) };
      filter.dueDate = { $lte: new Date(effectiveTo) };
    } else if (effectiveFrom) {
      filter.startDate = { $gte: new Date(effectiveFrom) };
    } else if (effectiveTo) {
      filter.dueDate = { $lte: new Date(effectiveTo) };
    }

    if (assignedTo) {
      filter.assignedTo = { $regex: assignedTo, $options: "i" };
    }

    if (status) {
      filter.applicationStatus = status;
    }

    const tasks = await taskModel.find(filter);
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

export const createTask = async (req, res) => {
  try {
    const task = new taskModel(req.body);
    await task.save();
    if (req.body.dateOfApproval) {
      // Find the company based on companyName in companyDetails and update the gst.status
      await Company.findOneAndUpdate(
        { "companyDetails.companyName": req.body.company }, // Query to find the document
        { $set: { "gst.status": "active" } }, // Update operation
        { new: true } // Option to return the updated document
      );
    }

    if (req.body.fileReturnStatus) {
      // Set gst.status to 'inactive'
      await Company.findOneAndUpdate(
        { "companyDetails.companyName": req.body.company },
        { $set: { "gst.status": "inactive" } }, // Update operation
        { new: true } // Option to return the updated document
      );
    }

    return res.status(201).send({
      success: true,
      message: "Task created successfully",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Update a task by ID
export const updateTask = async (req, res) => {
  try {
    const task = await taskModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (req.body.dateOfApproval) {
      // Find the company based on companyName in companyDetails and update the gst.status
      await Company.findOneAndUpdate(
        { "companyDetails.companyName": req.body.company }, // Query to find the document
        { $set: { "gst.status": "active" } }, // Update operation
        { new: true } // Option to return the updated document
      );
    }

    if (req.body.applicationSubStatus == "rejected") {
      // Find the company based on companyName in companyDetails and update the gst.status
      await Company.findOneAndUpdate(
        { "companyDetails.companyName": req.body.company }, // Query to find the document
        { $set: { "gst.status": "inactive" } }, // Update operation
        { new: true } // Option to return the updated document
      );
    }

    if (req.body.appealFileReturnStatus) {
      // Set gst.status to 'inactive'
      await Company.findOneAndUpdate(
        { "companyDetails.companyName": req.body.company }, // Query to find the document
        { $set: { "gst.status": "inactive" } }, // Update operation
        { new: true } // Option to return the updated document
      );
    }
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
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
