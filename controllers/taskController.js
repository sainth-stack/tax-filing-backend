// controllers/taskController.js
import taskModel from "./../models/taskModel.js";
import Company from '../models/companyModel.js'


export const getTasks = async (req, res) => {
  const { company, effectiveFrom, effectiveTo } = req.body;

  try {
    // Initialize an empty filter object
    const filter = {};

    // Add company filter if provided
    if (company) {
      filter['company'] = { $regex: company, $options: 'i' }; // Case-insensitive match
    }

    // Add date range filters if provided
    if (effectiveFrom && effectiveTo) {
      filter.startDate = { $gte: new Date(effectiveFrom) };
      filter.dueDate = { $lte: new Date(effectiveTo) };
    } else if (effectiveFrom) {
      filter.startDate = { $gte: new Date(effectiveFrom) };
    } else if (effectiveTo) {
      filter.dueDate = { $lte: new Date(effectiveTo) };
    }

    // Fetch tasks based on the filter criteria (if any)
    const tasks = await taskModel.find(filter);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
        { 'companyDetails.companyName': req.body.company }, // Query to find the document
        { $set: { 'gst.status': 'active' } }, // Update operation
        { new: true } // Option to return the updated document
      );
    }

    if (req.body.fileReturnStatus) {
      // Set gst.status to 'inactive'
      await Company.findOneAndUpdate(
        { 'companyDetails.companyName': req.body.company }, // Query to find the document
        { $set: { 'gst.status': 'inactive' } }, // Update operation
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
        { 'companyDetails.companyName': req.body.company }, // Query to find the document
        { $set: { 'gst.status': 'active' } }, // Update operation
        { new: true } // Option to return the updated document
      );
    }

    if (req.body.applicationSubStatus =="rejected") {
      // Find the company based on companyName in companyDetails and update the gst.status
      await Company.findOneAndUpdate(
        { 'companyDetails.companyName': req.body.company }, // Query to find the document
        { $set: { 'gst.status': 'inactive' } }, // Update operation
        { new: true } // Option to return the updated document
      );
    }

    if (req.body.appealFileReturnStatus) {
      // Set gst.status to 'inactive'
      await Company.findOneAndUpdate(
        { 'companyDetails.companyName': req.body.company }, // Query to find the document
        { $set: { 'gst.status': 'inactive' } }, // Update operation
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
