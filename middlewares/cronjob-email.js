import cron from 'node-cron';
import mongoose from 'mongoose'; // Import mongoose
import User from '../models/employeeModel.js';
import Task from '../models/taskModel.js';
import connectDB from '../config/db.js';
import sendEmail from '../middlewares/sendEmail.js';
import emailTemplates from '../templates/emailTemplates.js';
import NotificationModel from '../models/NotificationModel.js'; // Adjust the import as necessary

// Connect to the database
connectDB();

// Helper function to set time to start and end of the day
const getStartOfDay = (date) => new Date(date.setHours(0, 0, 0, 0));
const getEndOfDay = (date) => new Date(date.setHours(23, 59, 59, 999));

cron.schedule('0 6 * * *', async () => {
  console.log('Running task reminder check...');

  // Get today's date and set start/end boundaries for today and tomorrow
  const today = new Date();
  const startOfToday = getStartOfDay(new Date(today));
  const endOfToday = getEndOfDay(new Date(today));
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const startOfTomorrow = getStartOfDay(new Date(tomorrow));
  const endOfTomorrow = getEndOfDay(new Date(tomorrow));

  try {
    const tasksDueToday = await Task.find({
      dueDate: { $gte: startOfToday, $lt: endOfToday },
      actualCompletionDate: { $in: [null, ""] },  // Match tasks that are either null or empty string
    });

    const tasksDueTomorrow = await Task.find({
      dueDate: { $gte: startOfTomorrow, $lt: endOfTomorrow },
      actualCompletionDate: { $in: [null, ""] },  // Match tasks that are either null or empty string
    });

    const overdueTasks = await Task.find({
      dueDate: { $lt: startOfToday },
      actualCompletionDate: { $in: [null, ""] },  // Match tasks that are either null or empty string
    });

    // Send reminders for tasks due tomorrow
    await sendReminders(tasksDueTomorrow, "dueDateReminderBefore");

    // Send reminders for tasks due today
    await sendReminders(tasksDueToday, "dueDateReminderAfter");

    // Send reminders for overdue tasks
    await sendReminders(overdueTasks, "dueDateReminderAfter", true);

    console.log('Reminder check completed.');
  } catch (error) {
    console.error('Error running reminder check:', error);
  }
});

async function sendReminders(tasks, templateType, overdue = false) {
  for (const task of tasks) {
    // Ensure assignedTo is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(task.assignedTo)) {
      console.error(`Invalid ObjectId for assignedTo: ${task.assignedTo}`);
      continue; // Skip this iteration if invalid
    }

    // Fetch the user based on assignedTo ID
    const user = await User.findOne({ _id: task.assignedTo, status: true });

    // Check if the assigned user exists and is active
    if (user) {
      // Fetch notification settings for the user's agency
      const notificationSettings = await NotificationModel.findOne({ agency: user.agency });

      if (notificationSettings) {
        const { firstName } = user;
        const dueDate = task.dueDate.toLocaleDateString();
        const { subject, body } = emailTemplates[templateType](task.taskName, firstName, dueDate);

        // Check for overdue reminders
        if (overdue) {
          if (notificationSettings.oneDayAfterDueDate) {
            console.log(`Sending overdue reminder to ${task.assignedTo}`);
            // Send the email
            await sendEmail(user.email, subject, body);
          }
        } else {
          // Handle reminders based on the template type
          if (templateType === "dueDateReminderBefore" && notificationSettings.oneDayBeforeDueDate) {
            console.log(`Sending reminder for ${task.assignedName} to ${task.assignedTo}`);
            await sendEmail(user.email, subject, body);
          } else if (templateType === "dueDateReminderAfter" && notificationSettings.oneDayAfterDueDate) {
            console.log(`Sending reminder for ${task.assignedName} to ${task.assignedTo}`);
            await sendEmail(user.email, subject, body);
          }
        }
      } else {
        console.log(`No notification settings found for ${task.assignedTo}`);
      }
    } else {
      console.log(`User not found or inactive for assignedTo: ${task.assignedTo}`);
    }
  }
}

