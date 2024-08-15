// models/Task.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const taskSchema = new Schema({
  company: {
    type: String,
  },
  assignedTo: {
    type: String,
  },
  priority: {
    type: String,
    enum: ["high", "medium", "low"],
  },
  startDate: {
    type: Date,
  },
  dueDate: {
    type: Date,
  },
  actualCompletionDate: {
    type: Date,
  },
  taskType: {
    type: String,
    enum: [
      "gst",
      "providentFund",
      "incomeTax",
      "tds",
      "esi",
      "professionalTax",
    ],
  },
  attachment: {
    type: String,
  },
  taskName: {
    type: String,
  },
  applicationNumber: {
    type: String,
  },
  applicationSubstatus: {
    type: String,
  },
  arn: {
    type: String,
  },
  gstUsername: {
    type: String,
  },
  prn: {
    type: String,
  },
  legalName: {
    type: String,
  },
  tradeName: {
    type: String,
  },
  filingPeriod: {
    type: String,
  },
  uploadStatus: {
    type: String,
    enum: ["uploaded", "pending", "failed"],
  },
  errorCode: {
    type: String,
  },
  errorDescription: {
    type: String,
  },
  periodOfReturn: {
    type: String,
  },
  gstFilingStatus: {
    type: String,
    enum: ["filed", "notFiled"],
  },
  filedDate: {
    type: Date,
  },
  effectiveDate: {
    type: Date,
  },
  order: {
    type: Number,
  },
  businessName: {
    type: String,
  },
  attachment: {
    type: String,
  },
  filingMode: {
    type: String,
  },
  prnDate: {
    type: Date,
  },
  arnDate: {
    type: Date,
  },
});

const taskModel = mongoose.model("Task", taskSchema);

export default taskModel;
