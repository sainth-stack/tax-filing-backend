// controllers/notificationController.js
import NotificationModel from "./../models/NotificationModel.js";

// Create a notification
export const createNotification = async (req, res) => {
  try {
    const notification = new NotificationModel(req.body);
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all notifications
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await NotificationModel.find();
    res
      .status(200)
      .send({ message: "all notifications fetched", notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single notification by ID
export const getNotificationById = async (req, res) => {
  try {
    const notification = await NotificationModel.find({
      agency: req.params.id,
    });

    console.log("notification", req.params.id);
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a notification
export const updateNotification = async (req, res) => {
  try {
    // Update the notification and return the updated document
    const notification = await NotificationModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // This option returns the updated document
    );

    // Check if the notification was found and updated
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error("Error updating notification:", error); // Log the error for debugging
    res.status(400).json({ message: error.message });
  }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const notification = await NotificationModel.findByIdAndDelete(
      req.params.id
    );
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};