// controllers/taskController.js

import ServiceCalendarModel from "../models/ServiceCalendar.js";

export const createServiceCalendar = async (req, res) => {
  console.log("Request Body:", req.body); // This shows what you're sending

  // Assuming req.body is an array of tasks
  try {
    const savedEntries = await ServiceCalendarModel.insertMany(req.body);
    res.status(201).json(savedEntries); // Return the saved entries
  } catch (error) {
    console.error("Error saving calendar entry:", error.message); // Log the error
    res.status(400).json({ message: error.message });
  }
};

// Get all service calendar entries
export const getServiceCalendars = async (req, res) => {
  try {
    const calendars = await ServiceCalendarModel.find();
    res.status(200).json({ calendars, message: "Service Calendars fetched" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update a service calendar entry by ID
export const updateServiceCalendar = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body; // Contains updated data

  try {
    const updatedTask = await ServiceCalendarModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating calendar entry:", error.message);
    res.status(400).json({ message: error.message });
  }
};

export const deleteAllServiceCalendarEntries = async (req, res) => {
  try {
    // Delete all entries
    await ServiceCalendarModel.deleteMany({});

    res.status(200).json({ message: "All tasks deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
