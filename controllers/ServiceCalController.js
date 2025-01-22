// controllers/taskController.js

import ServiceCalendarModel from "../models/ServiceCalendar.js";
import AutoTaskModel from "./../models/AutoTaskModel.js";

export const createServiceCalendar = async (req, res) => {
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

const updateTasks = async (date,taskId) => {
  console.log(date,taskId)
  if (!date) {
    console.error("Date is required for the update");
    return;
  }

  try {
    const inputDate = new Date(date);
    if (isNaN(inputDate)) {
      throw new Error("Invalid date provided");
    }

    inputDate.setMonth(inputDate.getMonth() + 1);
    const updatedMonth = inputDate.getMonth(); // `getMonth` is 0-based
    const updatedYear = inputDate.getFullYear();
    const updatedDay = inputDate.getDate(); // Day from the new date
    const gstMonthly_gstType = taskId.split('-').length > 1 ? taskId.split('-')[1] : "";
    const query = {
      dueDate: { $exists: true }, // Ensure dueDate exists
      $expr: {
        $and: [
          { $eq: [{ $month: "$dueDate" }, updatedMonth] },
          { $eq: [{ $year: "$dueDate" }, updatedYear] },
        ],
      },
    };
    
    // Conditionally add gstMonthly_gstType if it exists
    if (gstMonthly_gstType) {
      query.gstMonthly_gstType = gstMonthly_gstType;
    }
    const result = await AutoTaskModel.updateMany(
   query,
      {
        $set: {
          dueDate: new Date(updatedYear, updatedMonth - 1, updatedDay), // Update `dueDate` to the new day
          updatedAt: new Date(), // Update the `updatedAt` timestamp
        },
      }
    );

    console.log(`Updated ${result.modifiedCount} tasks.`);
  } catch (error) {
    console.error("Error updating tasks:", error.message);
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

      let prevDatesEntry = updatedTask.prevDates.find(
        (entry) => entry.name === name
      );

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

    updateTasks(date,updateData?.taskId);
    // Explicitly set prevDates to ensure it is recognized during the save
    updatedTask.prevDates = updatedTask.prevDates.map((entry) =>
      entry.name === name ? { ...entry, history: [...entry.history] } : entry
    );

    updatedTask.date = new Date(date);
    if (updateData.taskId) updatedTask.taskId = updateData.taskId;
    if (updateData.name) updatedTask.name = updateData.name;
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
