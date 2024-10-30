// models/Task.js
import mongoose from "mongoose";

const ServiceCalendar = new mongoose.Schema(
  {
    name: {
      type: String,
      /* required: true, */
    },
    date: {
      type: Date,
      /* required: true, */
    },
    taskId: {
      type: String
    }
  },
  { timestamps: true }
);

const ServiceCalendarModel = mongoose.model(
  "ServiceCalendarModel",
  ServiceCalendar
);

export default ServiceCalendarModel;
