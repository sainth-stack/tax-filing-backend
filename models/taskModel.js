// models/Task.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  actualCompletionDate: {
    type: Date,
  },
  taskType: {
    type: String,
    required: true,
  },
  taskName: {
    type: String,
    required: true,
  },
  applicationStatus: {
    type: String,
    required: true,
  },
  arn: {
    type: String,
  },
  arnDate: {
    type: Date,
  },
  applicationSubStatus: {
    type: String,
  },
  dateOfApproval: {
    type: Date,
  },
});

const taskModel = mongoose.model("Task", taskSchema);

export default taskModel;
