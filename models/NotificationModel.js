import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    oneDayBeforeDueDate: {
      type: Boolean,
      //required: true,
    },
    oneDayAfterDueDate: {
      type: Boolean,
      //required: true,
    },
    assignNewTask: {
      type: Boolean,
      //required: true,
    },

    toAddress: {
      type: Array,
      //required: false,
    },
    ccAddress: {
      type: Array,
      //required: false,
    },
    agency:{
      type:String
    },
    subject: {
      type: String,
      //required: true,
    },
    message: {
      type: String,
      //required: true,
    },
    attachments: {
      type: [String],
      // required: false, // Uncomment if you want to make this required
    },
  },
  {
    timestamps: true,
  }
);

// Create the Email model
const NotificationModel = mongoose.model("Notification", NotificationSchema);

export default NotificationModel;
