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
  //income TAX- Model here

  tax_taskName: {
    type: String,
    enum: [
      "incomeTaxAuditCases",
      "incomeTaxNonAuditCases",
      "incomeTaxAdvanceTax",
    ],
    required: true,
  },
  tax_formStatus: {
    type: String,
    enum: ["filed", "notFiled"],
  },
  tax_filingStatus: {
    type: String,
    enum: ["filed", "notFiled"],
  },
  tax_paymentStatus: {
    type: String,
    enum: ["taxPaid", "taxNotPaid", "partiallyPaid", "verified", "notVerified"],
  },
  tax_paymentAmount: {
    type: Number,
  },
  tax_paymentDate: {
    type: Date,
  },
  tax_verifiedDate: {
    type: Date,
  },
  tax_quarter: {
    type: String,
    enum: ["quarter1", "quarter2", "quarter3", "quarter4"],
  },

  // Additional fields for different scenarios
  tax_audit_formStatus: {
    type: String,
    enum: ["filed", "notFiled"],
  },
  tax_audit_filingStatus: {
    type: String,
    enum: ["filed", "notFiled"],
  },
  tax_audit_paymentStatus: {
    type: String,
    enum: ["taxPaid", "taxNotPaid", "partiallyPaid", "verified"],
  },
  tax_audit_paymentAmount: {
    type: Number,
  },
  tax_audit_paymentDate: {
    type: Date,
  },

  tax_nonAudit_filingStatus: {
    type: String,
    enum: ["filed", "notFiled"],
  },
  tax_nonAudit_paymentStatus: {
    type: String,
    enum: ["taxPaid", "taxNotPaid", "partiallyPaid", "verified", "notVerified"],
  },
  tax_nonAudit_paymentAmount: {
    type: Number,
  },
  tax_nonAudit_paymentDate: {
    type: Date,
  },
  tax_nonAudit_verifiedDate: {
    type: Date,
  },

  tax_advanceTax_quarter: {
    type: String,
    enum: ["quarter1", "quarter2", "quarter3", "quarter4"],
  },
  tax_advanceTax_paymentStatus: {
    type: String,
    enum: ["taxPaid", "taxNotPaid", "partiallyPaid", "verified"],
  },
  tax_advanceTax_paymentAmount: {
    type: Number,
  },
  tax_advanceTax_paymentDate: {
    type: Date,
  },
  tax_advanceTax_filingStatus: {
    type: String,
    enum: ["filed", "notFiled"],
  },

  //esi - model

  taskName: {
    type: String,
    enum: ["esiNewRegistration", "esiRegularMonthlyActivity", "esiInactive"],
    required: true,
  },
  esi_new_applicationStatus: {
    type: String,
    enum: ["pendingForApply", "applied"],
  },
  esi_new_applicationNumber: {
    type: String,
  },
  esi_new_applicationDate: {
    type: Date,
  },
  esi_new_applicationSubStatus: {
    type: String,
    enum: [
      "pendingForApproval",
      "pendingForClarification",
      "rejected",
      "approved",
    ],
  },
  esi_new_dateOfApproval: {
    type: Date,
  },

  esi_typeOfGSTForm: {
    type: String,
    enum: ["gstr1", "gstr3b"],
  },
  esi_filingStatus: {
    type: String,
    enum: ["filed", "notFiled"],
  },
  esi_previousMonthNotFiled: {
    type: String,
    enum: ["yes", "no"],
  },
  esi_currentStatus: {
    type: String,
    enum: ["documentsPending", "waitingForClarification", "workInProgress"],
  },
  esi_fileDate: {
    type: Date,
  },

  esi_inactive_applicationStatus: {
    type: String,
    enum: ["closureApplied", "inactiveDueToNonFiling"],
  },
  esi_inactive_applicationNumber: {
    type: String,
  },
  esi_inactive_applicationDate: {
    type: Date,
  },
  esi_inactive_applicationSubStatus: {
    type: String,
    enum: [
      "pendingForApproval",
      "pendingForClarification",
      "rejected",
      "approved",
    ],
  },
  esi_inactive_dateOfApproval: {
    type: Date,
  },
  //professional tax

  // Task Name
  pft_taskName: {
    type: String,
    enum: [
      "professionalTaxNewRegistration",
      "professionalTaxRegularMonthlyActivity",
      "professionalTaxInactive",
    ],
    required: true,
  },

  // Professional Tax - New Registration
  pft_applicationStatus: {
    type: String,
    enum: ["pendingForApply", "applied"],
  },
  pft_applicationNumber: {
    type: String,
  },
  pft_applicationDate: {
    type: Date,
  },
  pft_applicationSubStatus: {
    type: String,
    enum: [
      "pendingForApproval",
      "pendingForClarification",
      "rejected",
      "approved",
    ],
  },
  pft_new_dateOfApproval: {
    type: Date,
  },

  // Professional Tax - Regular Monthly Activity
  pft_typeOfGSTForm: {
    type: String,
    enum: ["gstr1"],
  },
  pft_filingStatus: {
    type: String,
    enum: ["filed", "notFiled"],
  },
  pft_currentStatus: {
    type: String,
    enum: ["documentsPending", "waitingForClarification", "workInProgress"],
  },
  pft_fileDate: {
    type: Date,
  },

  // Professional Tax - Inactive
  pft_inactive_applicationStatus: {
    type: String,
    enum: ["closureApplied", "inactiveDueToNonFiling"],
  },
  pft_inactive_applicationNumber: {
    type: String,
  },
  pft_inactive_applicationDate: {
    type: Date,
  },
  pft_inactive_applicationSubStatus: {
    type: String,
    enum: [
      "pendingForApproval",
      "pendingForClarification",
      "rejected",
      "approved",
    ],
  },
  pft_inactive_dateOfApproval: {
    type: Date,
  },
});

const taskModel = mongoose.model("Task", taskSchema);

export default taskModel;
