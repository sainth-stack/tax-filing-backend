// controllers/taskController.js
import taskModel from "./../models/taskModel.js";

export const createTask = async (req, res) => {
  try {
    const {
      company,
      assignedTo,
      priority,
      startDate,
      dueDate,
      actualCompletionDate,
      taskType,
      taskName,
      applicationStatus,
      arn,
      arnDate,
      applicationSubStatus,
      dateOfApproval,
    } = req.body;

    if (
      !(
        company &&
        assignedTo &&
        priority &&
        startDate &&
        dueDate &&
        taskType &&
        taskName &&
        applicationStatus
      )
    ) {
      return res.status(400).send({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const task = new taskModel({
      company,
      assignedTo,
      priority,
      startDate,
      dueDate,
      actualCompletionDate,
      taskType,
      taskName,
      applicationStatus,
      arn,
      arnDate,
      applicationSubStatus,
      dateOfApproval,
    });

    await task.save();

    return res.status(201).send({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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

// Update a task by ID
export const updateTask = async (req, res) => {
  try {
    const task = await taskModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
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
