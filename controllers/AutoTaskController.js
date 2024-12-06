// controllers/taskController.js
import { uploadFileToDrive } from "../middlewares/drive.js";
import Company from "../models/companyModel.js";
import User from "../models/employeeModel.js";
import AutoTaskModel from "./../models/AutoTaskModel.js";
import fs from "fs";
import path from "path";
import emailTemplates from "../templates/emailTemplates.js";
import sendEmail from "../middlewares/sendEmail.js";
import NotificationModel from "../models/NotificationModel.js";

export const createAutoTask = async (req, res) => {
  try {
    const { body, files } = req;
    const fileLinks = {};

    // Handle file uploads
    for (const file of files) {
      const filePath = path.join(file.destination, file.filename); // Full path to the file
      const uploadResponse = await uploadFileToDrive(filePath);
      fileLinks[file.fieldname] = uploadResponse?.url;
      fs.unlinkSync(filePath); // Clean up temp file
    }

    const { assignedTo, taskName } = body;

    if (assignedTo) {
      // Fetch user based on the assignedTo string (assuming it is some identifier)
      const user = await User.findOne({ _id: assignedTo }).select(
        "firstName email agency"
      );
      if (user) {
        body.assignedName = user.firstName + " " + (user?.lastName || '');

        // Fetch notification settings for the user's agency
        const notificationSettings = await NotificationModel.findOne({
          agency: user.agency,
        });
        // Check if the assignNewTask notification is enabled
        if (notificationSettings && notificationSettings.assignNewTask.status) {
          const subject =
            notificationSettings.assignNewTask.roleData.subject ||
            emailTemplates.assignTask(taskName, user.firstName).subject;
          const bodyContent =
            notificationSettings.assignNewTask.roleData.message ||
            emailTemplates.assignTask(taskName, user.firstName).body;

          // Send email to the assigned user
          sendEmail(user.email, subject, bodyContent);
        }
      } else {
        body.assignedName = ""; // or some default value
      }
    } else {
      body.assignedName = "";
    }

    // Prepare task data
    const taskData = {
      ...body,
      ...fileLinks,
    };

    const AutoTask = await AutoTaskModel.create(taskData);
    await AutoTask.save();

    // Update company GST status and approvalCertificate based on task fields
    const updateData = {};

    if (body.dateOfApproval) {
      updateData["gst.status"] =
        body.taskName === "gstNewRegistration" ? "active" : "inactive";
    }

    if (fileLinks.approvalCertificate) {
      updateData["gst.approvalCertificate"] = fileLinks.approvalCertificate;
    }

    if (Object.keys(updateData).length > 0) {
      await Company.findOneAndUpdate(
        { "companyDetails.companyName": body.company }, // Query to find the document
        { $set: updateData }, // Update operation
        { new: true } // Option to return the updated document
      );
    }

    return res.status(201).send({
      success: true,
      message: "Task created successfully",
      AutoTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(400).json({ error: error.message });
  }
};
// get all tasks
export const getAllAutoTasks = async (req, res) => {
  try {
    const AutoTasks = await AutoTaskModel.find();

    res.status(200).json({
      success: true,
      data: AutoTasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getAutoTasks = async (req, res) => {
  const {
    company,
    effectiveFrom,
    effectiveTo,
    assignedTo,
    status,
    applicationSubStatus,
    taskType,
    year,
    month,
    user,
    list
  } = req.body;

  try {
    const filter = {};
    if (list) {
      const userRecord = await User.findById(list).lean().exec();
      if (!userRecord) {
        return res.status(404).json({ error: "User not found" });
      }
      const userCompanies = userRecord.company?.map(comp => comp?.label) || [];
      filter.company = { $in: userCompanies };

      filter.$or = [
        { assignedTo: list },
        { assignedTo: "" },
        { assignedTo: null },
        { assignedTo: { $exists: false } }
      ];
    }

    if (company) {
      if (filter.company) {
        filter.company = {
          $in: filter.company.$in,
          $regex: company,
          $options: "i"
        };
      } else {
        filter.company = { $regex: company, $options: "i" };
      }
    }

    if (effectiveFrom && effectiveTo) {
      filter.startDate = { $gte: new Date(effectiveFrom) };
      filter.dueDate = { $lte: new Date(effectiveTo) };
    } else if (effectiveFrom) {
      filter.startDate = { $gte: new Date(effectiveFrom) };
    } else if (effectiveTo) {
      filter.dueDate = { $lte: new Date(effectiveTo) };
    }

    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }


    if (applicationSubStatus == 'gstr3b' || applicationSubStatus == 'gstr1') {
      filter.gstMonthly_gstType = applicationSubStatus;
    }
    else if (applicationSubStatus) {
      filter.taskName = applicationSubStatus;
    }

    if (status === 'filed') {
      filter.$or = [
        { pfMonthly_filedate: { $ne: null } },
        { esi_fileDate: { $ne: null } },
        { pft_fileDate: { $ne: null } },
        { gstMonthly_filedate: { $ne: null } }
      ];
    } else if (status === 'notFiled') {
      filter.pfMonthly_filedate = null;
      filter.esi_fileDate = null;
      filter.pft_fileDate = null;
      filter.gstMonthly_filedate = null;
    }

    if (taskType) {
      filter.taskType = taskType;
    }

    if (year && month) {
      // Create dates with explicit UTC time
      const startDate = new Date(Date.UTC(year, month - 1, 1));  // First day of target month at 00:00:00 UTC
      const endDate = new Date(Date.UTC(year, month, 0));   // Last day of target month at 00:00:00 UTC
      endDate.setUTCHours(23, 59, 59, 999);  // Set to end of day

      // Match tasks where startDate falls within the target month
      filter.startDate = {
        $gte: startDate,
        $lte: endDate
      };
    } else if (year) {
      const startOfYear = new Date(`${year}-01-01`);
      const endOfYear = new Date(`${year}-12-31`);

      filter.startDate = {
        $lte: endOfYear.toISOString(),
      };
      filter.dueDate = {
        $gte: startOfYear.toISOString(),
      };
    }
    console.log(filter)

    // Retrieve tasks based on the filter
    const AutoTasks = await AutoTaskModel.find(filter);

    // Send the tasks in the response
    return res.status(200).send(AutoTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "An error occurred while fetching tasks." });
  }
};

// Get a single task by ID
export const getAutoTaskById = async (req, res) => {
  try {
    // Find the task by ID and populate the 'company' field with the Company document
    const AutoTask = await AutoTaskModel.findById(req.params.id).populate(
      "company"
    );

    if (!AutoTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(AutoTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAutoTask = async (req, res) => {
  try {
    const { body, files } = req;
    const file = files[0]; // Access the single file from req.files

    let fileLink = null;
    if (file) {
      const filePath = path.join(file.destination, file.filename); // Full path to the file
      const uploadResponse = await uploadFileToDrive(filePath);
      fileLink = uploadResponse.url;
      fs.unlinkSync(filePath); // Clean up temp file
    }

    // Fetch the existing task to check if 'assignedTo' has changed
    const existingAutoTask = await AutoTaskModel.findById(req.params.id);

    if (!existingAutoTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    const AutoTaskData = { ...body };
    if (fileLink) {
      AutoTaskData.attachment = fileLink;
    }


    if (body.assignedTo && body.assignedTo !== existingAutoTask.assignedTo) {
      // Fetch the new assigned user details
      const user = await User.findOne({ _id: body.assignedTo });
      if (user) {
        AutoTaskData.assignedName = user.firstName + " " + (user?.lastName || '');
        // Fetch notification settings for the user's agency
        const notificationSettings = await NotificationModel.findOne({
          agency: user.agency,
        });

        // Check if assignNewTask notification is enabled
        if (notificationSettings && notificationSettings.assignNewTask.status) {
          const subject =
            notificationSettings.assignNewTask.roleData.subject ||
            emailTemplates.assignTask(updatedTask.taskName, user.firstName)
              .subject;
          const bodyContent =
            notificationSettings.assignNewTask.roleData.message ||
            emailTemplates.assignTask(updatedTask.taskName, user.firstName)
              .body;

          // Send email notification to the new assignee
          sendEmail(user.email, subject, bodyContent);
        }
      }
    }

    // Update company GST status based on task fields
    if (body.dateOfApproval) {
      await Company.findOneAndUpdate(
        { "companyDetails.companyName": body.company }, // Query to find the document
        {
          $set: {
            "gst.status":
              body.taskName === "gstNewRegistration" ? "active" : "inactive",
          },
        }, // Update operation
        { new: true } // Option to return the updated document
      );
    }

    if (body.appealFileReturnStatus) {
      await Company.findOneAndUpdate(
        { "companyDetails.companyName": body.company },
        { $set: { "gst.status": "inactive" } }, // Update operation
        { new: true } // Option to return the updated document
      );
    }

    // Update the task
    const updatedAutoTask = await AutoTaskModel.findByIdAndUpdate(
      req.params.id,
      AutoTaskData,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedAutoTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(400).json({ error: error.message });
  }
};

// Delete a task by ID
export const deleteAutoTask = async (req, res) => {
  try {
    const AutoTask = await AutoTaskModel.findByIdAndDelete(req.params.id);
    if (!AutoTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadFiles = async (req, res) => {
  try {
    const files = req.files; // Access the files from req.files
    const fileLinks = {};

    for (const file of files) {
      const fileName = file.filename; // File name on disk
      const filePath = path.join(file.destination, file.filename); // Full path to the file
      const uploadResponse = await uploadFileToDrive(filePath);
      fileLinks[file.fieldname] = uploadResponse.webViewLink;
      fs.unlinkSync(filePath); // Clean up temp file
    }


    const task = await AutoTaskModel.findById(req.body.taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    task.attachments = {
      ...task.attachments,
      ...fileLinks,
    };
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(400).json({ error: error.message });
  }
};
