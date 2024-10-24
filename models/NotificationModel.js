import mongoose from "mongoose";

const RoleDataSchema = new mongoose.Schema({
  toAddress: {
    type: [], // Array of email addresses
    default: [], // Default to an empty array
  },
  ccAddress: {
    type: [], 
    default: [],
  },
  subject: {
    type: String,
    default: "",
  },
  message: {
    type: String,
    default: "",
  },
  attachment: {
    type: String, // Store single file path or name
    default: "",
  },
});

const NotificationSchema = new mongoose.Schema(
  {
    oneDayBeforeDueDate: {
      status: { type: Boolean, default: false },
      name: { type: String, default: "One Day Before DueDate" },
      roleData: { type: RoleDataSchema, default: () => ({}) },
    },
    oneDayAfterDueDate: {
      status: { type: Boolean, default: false },
      name: { type: String, default: "One Day After DueDate" },
      roleData: { type: RoleDataSchema, default: () => ({}) },
    },
    assignNewTask: {
      status: { type: Boolean, default: false },
      name: { type: String, default: "Assign New Task" },
      roleData: { type: RoleDataSchema, default: () => ({}) },
    },
    agency: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

// Create the Notification model
const NotificationModel = mongoose.model("Notification", NotificationSchema);

export default NotificationModel;
