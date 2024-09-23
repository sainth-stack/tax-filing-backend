// models/Task.js
import { application } from "express";
import mongoose from "mongoose";

const { Schema } = mongoose;

const taskSchema = new Schema({
  company: {
    type: String,
  },
  assignedTo: {
    type: String,
  },
  assignedName: {
    type: String,
  },
  priority: {
    type: String,
  },
  startDate: {
    require: true,

    type: Date,
  },
  dueDate: {
    require: true,

    type: Date,
  },
  actualCompletionDate: {
    require: true,
    type: Date,
  },
  taskType: {
    type: String,
  },

  taskName: {
    type: String,
  },
  attachment: {
    type: String,
  },
  acknowledgement: {
    type: String,
  },
  challan: {
    type: String,
  },
  approvalCertificate: {
    type: String,
  },
  remarks: {
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
  tdstcsMonthly_filingStatus: {
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
  },
  tax_formStatus: {
    type: String,
  },
  taxMonthly_filingStatus: {
    type: String,
  },
  taxmonthly_paymentStatus: {
    type: String,
  },
  tax_filing_e_Date: {
    type: Number,
  },
  tax_paymentAmount: {
    type: Number,
  },
  tax_verification_date: {
    type: Date,
  },
  tax_filingDate: {
    type: Date,
  },
  tax_paymentDate: {
    type: Date,
  },
  tax_verifiedDate: {
    type: Date,
  },
  tax_quarter: {
    type: String,
  },

  // Additional fields for different scenarios
  tax_audit_formStatus: {
    type: String,
  },
  tax_audit_filingStatus: {
    type: String,
  },
  tax_audit_paymentStatus: {
    type: String,
  },
  tax_audit_paymentAmount: {
    type: Number,
  },
  tax_audit_paymentDate: {
    type: Date,
  },

  tax_nonAudit_filingStatus: {
    type: String,
  },
  tax_nonAudit_paymentStatus: {
    type: String,
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
  },
  tax_advanceTax_paymentStatus: {
    type: String,
  },
  tax_advanceTax_paymentAmount: {
    type: Number,
  },
  tax_advanceTax_paymentDate: {
    type: Date,
  },
  tax_advanceTax_filingStatus: {
    type: String,
  },

  //esi - model

  taskName: {
    type: String,
  },
  esi_new_applicationStatus: {
    type: String,
  },
  esi_new_applicationNumber: {
    type: String,
  },
  esi_new_applicationDate: {
    type: Date,
  },
  esi_new_applicationSubStatus: {
    type: String,
  },
  esi_new_dateOfApproval: {
    type: Date,
  },

  esi_typeOfGSTForm: {
    type: String,
  },
  esiMonthly_filingStatus: {
    type: String,
  },
  esi_previousMonthNotFiled: {
    type: String,
  },
  esi_currentStatus: {
    type: String,
  },
  esi_fileDate: {
    type: Date,
  },

  esi_inactive_applicationStatus: {
    type: String,
  },
  esi_inactive_applicationNumber: {
    type: String,
  },
  esi_inactive_applicationDate: {
    type: Date,
  },
  esi_inactive_applicationSubStatus: {
    type: String,
  },
  esi_inactive_dateOfApproval: {
    type: Date,
  },
  //professional tax

  // Task Name
  pft_taskName: {
    type: String,
  },

  // Professional Tax - New Registration
  pft_applicationStatus: {
    type: String,
  },
  pft_applicationNumber: {
    type: String,
  },
  pft_applicationDate: {
    type: Date,
  },
  pft_applicationSubStatus: {
    type: String,
  },
  pft_new_dateOfApproval: {
    type: Date,
  },

  // Professional Tax - Regular Monthly Activity
  pft_typeOfGSTForm: {
    type: String,
  },
  pftMonthly_filingStatus: {
    type: String,
  },
  pft_currentStatus: {
    type: String,
  },
  pft_fileDate: {
    type: Date,
  },

  // Professional Tax - Inactive
  pft_inactive_applicationStatus: {
    type: String,
  },
  pft_inactive_applicationNumber: {
    type: String,
  },
  pft_inactive_applicationDate: {
    type: Date,
  },
  pft_inactive_applicationSubStatus: {
    type: String,
  },
  pft_inactive_dateOfApproval: {
    type: Date,
  },
});

const taskModel = mongoose.model("Task", taskSchema);

export default taskModel;
