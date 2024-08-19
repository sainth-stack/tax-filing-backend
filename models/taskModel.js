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

  //PF registration

  pfRegistration_applicationStatus: {
    type: String,
  },
  pfRegistration_applicationNumber: {
    type: String,
  },
  pfRegistration_applicationDate: {
    type: Date,
  },
  pfRegistration_ApplicationSubStatus: {
    type: String,
  },
  pfRegistration_approval: {
    type: Date,
  },

  //PF monthly

  pfMonthly_filingStatus: {
    type: String,
  },
  pfMonthly_prevNotFiled: {
    type: String,
  },
  pfMonthly_currentStatus: {
    type: String,
  },
  pfMonthly_fileDate: {
    type: Date,
  },

  tdstcs_taskName: {
    type: String,
  },
  tdstcs_quarter: {
    type: String,
  },
  tdstcs_filingStatus: {
    type: String,
  },
  tdstcs_processingStatus: {
    type: String,
  },
  tdstcs_form16Generated: {
    type: String,
  },
  tdsmonthly_taskName: {
    type: String,
  },
  tdsmonthly_quarter: {
    type: String,
  },
  tdsmonthly_paymentStatus: {
    type: String,
  },
  tdsmonthly_paymentMonth: {
    type: String,
  },
  tdsmonthly_year: {
    type: String,
  },
  tdsmonthly_paidDate: {
    type: Date,
  },
});

const taskModel = mongoose.model("Task", taskSchema);

export default taskModel;
