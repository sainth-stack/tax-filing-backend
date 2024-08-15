// models/Task.js
import { application } from "express";
import mongoose from "mongoose";

const { Schema } = mongoose;

const taskSchema = new Schema({
  company: {
    type: String,
  } /*  */,
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
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

  gst: {
    Taskname: {
      type: String,
    },

    /* for gst new registration Field */
    gst_New_Registration: {
      applicationStatus: {
        type: String,
      },
      arn: {
        type: Number,
      },
      arn_date: {
        type: String,
      },
      applicationStatus: {
        type: String,
      },
      date_of_approval: {
        type: String,
      },
    },

    /* for gst  Inactive  registration Field */
    gst_inactive_Registration: {
      typeOfInactive: {
        type: String,
      },
      Cancellation_Status: {
        type: String,
      },
      applicationStatus: {
        type: String,
      },
      Need_to_Revoc_Cancellation: { type: String },
      arn: {
        type: Number,
      },
      arn_date: {
        type: String,
      },
      applicationStatus: {
        type: String,
      },
      date_of_approval: {
        type: String,
      },
      final_refund_status: {
        type: String,
      },
    },

    /* for gst    Refund Field */
    gst_refud: {
      applicationStatus: {
        type: String,
      },
      arn: {
        type: Number,
      },
      arn_date: {
        type: String,
      },
      applicationSubstatus: {
        type: String,
      },
      date_of_approval: {
        type: String,
      },
    },

    /* for gst    Amendents Field */

    gst_amendents: {
      applicationStatus: {
        type: String,
      },
      arn: {
        type: Number,
      },
      arn_date: {
        type: String,
      },
      applicationSubstatus: {
        type: String,
      },
      date_of_approval: {
        type: String,
      },
    },

    /* for gst    Monthly Filling  Field */
    gst_monthly_filling: {
      type_of_gst_form: {
        type: String,
      },
      gstr1: {
        type: String,
      },
      fillin_status: {
        type: String,
      },
      file_date: {
        type: String,
      },
      arn_number: {
        type: Number,
      },
      month: {
        type: Date,
      },
      year: {
        type: Date,
      },
      previous_month_not_filled: {
        type: String,
      },
    },

    /* for gst    Monthly Payment  Field */
    gst_monthly_payment: {
      quarter: {
        type: String,
      },
      payment: {
        type: String,
      },
      month: {
        type: String,
      },
      year: {
        type: String,
      },
      paymentDate: {
        type: String,
      },
    },
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
    type: Number,
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
