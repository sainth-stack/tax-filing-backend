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


export const updateServiceCalendar = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedTask = await ServiceCalendarModel.findById(id);

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const { date, name } = updateData;

    if (date && name) {
      const newDate = new Date(date);

      let prevDatesEntry = updatedTask.prevDates.find((entry) => entry.name === name);

      if (!prevDatesEntry) {
        prevDatesEntry = { name, history: [] };
        updatedTask.prevDates.push(prevDatesEntry);
      }

      const existingIndex = prevDatesEntry.history.findIndex((historyDate) => {
        const historyDateObj = new Date(historyDate);
        return (
          historyDateObj.getFullYear() === newDate.getFullYear() &&
          historyDateObj.getMonth() === newDate.getMonth()
        );
      });

      if (existingIndex > -1) {
        prevDatesEntry.history[existingIndex] = newDate.toISOString();
      } else {
        prevDatesEntry.history.push(newDate.toISOString());
      }

      prevDatesEntry.history.sort((a, b) => new Date(a) - new Date(b));
    }

    // Explicitly set prevDates to ensure it is recognized during the save
    updatedTask.prevDates = updatedTask.prevDates.map((entry) =>
      entry.name === name ? { ...entry, history: [...entry.history] } : entry
    );

    updatedTask.date = new Date(date);
    if (updateData.taskId) updatedTask.taskId = updateData.taskId;
    if (updateData.name) updatedTask.name = updateData.name;
    console.log(updatedTask.prevDates)
    await updatedTask.save();

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
