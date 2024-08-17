// models/Task.js
import { application } from "express";
import mongoose from "mongoose";

const { Schema } = mongoose;

const taskSchema = new Schema({
  company: {
    type: String,
  } /*  */,
  assignedTo: {
    type: String,
    // ref: "User",
  },
  assignedName: {
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

  taskName: {
    type: String,
  },

  /* for gst new registration Field */
  applicationStatus: {
    type: String,
  },
  arn: {
    type: Number,
  },
  arn_date: {
    type: String,
  },
  applicationSubStatus: {
    type: String,
  },
  date_of_approval: {
    type: String,
  },

  /* for gst  Inactive  registration Field */
  gstInactive_typeOfInactive: {
    type: String,
  },
  gstInactive_cancellationStatus: {
    type: String,
  },
  gstInactive_volApplicationStatus: {
    type: String,
  },
  gstInactive_arn: {
    type: String,
  },
  gstInactive_arnDate: {
    type: String,
  },
  gstInactive_applicationSubStatus: {
    type: String,
  },
  gstInactive_dateOfApproval: {
    type: String,
  },
  gstInactive_finalReturnStatus: {
    type: String,
  },
  gstInactive_needToRevoceCancellation: {
    type: String,
  },
  gstInactive_applicationStatus: {
    type: String,
  },
  gstInactive_goingForAppeal: {
    type: String,
  },
  gstInactive_rejectState: {
    type: String,
  },
  gstInactive_appealArn: {
    type: String,
  },
  gstInactive_appealArnDate: {
    type: String,
  },
  gstInactive_appealApplicationSubStatus: {
    type: String,
  },

  //monthly

  gstMonthly_gstType: {
    type: String,
  },
  gstMonthly_filingStatus: {
    type: String,
  },
  gstMonthly_previousMonth: {
    type: String,
  },
  gstMonthly_taxAmount: {
    type: String,
  },
  gstMonthly_fileDate: {
    type: String,
  },
  gstMonthly_monthlyarn: {
    type: Number,
  },
  gstMonthly_monthlyMonth: {
    type: Date,
  },
  gstMonthly_monthlyYear: {
    type: String,
  },

  gstMonthlyPayment_quarter: {
    type: String,
  },
  gstMonthlyPayment_payment: {
    type: String,
  },
  gstMonthlyPayment_monthlyMonth: {
    type: String,
  },
  gstMonthlyPayment_monthlyYear: {
    type: String,
  },
  gstMonthlyPayment_paymentDate: {
    type: String,
  },

  //for PF model

  pfRegistration_companyName: {
    type: String,
  },
  pfRegistration_registrationDate: {
    type: String,
  },
  pfMonthly_paymentQuarter: {
    type: String,
  },
  pfMonthly_paymentMonth: {
    type: String,
  },
  pfMonthly_paymentYear: {
    type: Number,
  },
  pfMonthly_paymentDate: {
    type: String,
  },
  pfAnnual_returnYear: {
    type: String,
  },

  //for pf registration

  submissionDate: {
    type: Date,
  },
  registrationNumber: {
    type: String,
  },

  // for pf-anuual
  filingDate: {
    type: Date,
  },
  totalEmployees: {
    type: Number,
  },
  totalAmount: {
    type: Number,
  },
  annualReturnNumber: {
    type: String,
  },

  quarter: {
    type: String,
  },
  filingStatus: {
    type: String,
  },
  processingStatus: {
    type: String,
  },
  form16Generated: {
    type: String,
  },

  // Fields for taskName: 'tdsTcsMonthly'
  paymentStatus: {
    type: String,
  },
  paymentMonth: {
    type: String,
  },

  paidDate: {
    type: String,
  },
  attachment: {
    type: String,
  },
});

const taskModel = mongoose.model("Task", taskSchema);

export default taskModel;
