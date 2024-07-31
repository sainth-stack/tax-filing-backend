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
  },
  actualCompletionDate: {
    type: Date,
  },
  taskType: {
    type: String,
  },
  taskName: {
    type: String,
  },
  applicationStatus: {
    type: String,
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
