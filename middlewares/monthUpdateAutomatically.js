import cron from 'node-cron';
import ServiceCalendarModel from '../models/ServiceCalendar.js';

// Schedule the job to run at 6:00 AM every day
cron.schedule('0 0 28 * *', async () => {
  console.log('Automatic month update started');
  try {
    // Get all documents from the database
    const calendars = await ServiceCalendarModel.find({});

    // Loop through each calendar document
    for (const calendar of calendars) {
      const currentDate = calendar.date;

      // Extract year, month, and day from the current date
      let year = currentDate.getFullYear();
      let newMonth = currentDate.getMonth() + 1; // Increment month (0-based to 1-based)
      const day = currentDate.getDate();

      // Handle year increment if newMonth exceeds December (11)
      if (newMonth > 11) {
        newMonth = 0; // Reset to January
        year += 1; // Move to next year if month exceeds December
      }

      // Calculate the new date
      const newDate = new Date(year, newMonth, day, 18, 30, 0); // Set to 18:30:00 of the new month

      // Update the document with the new date
      await ServiceCalendarModel.updateOne(
        { _id: calendar._id },
        { $set: { date: newDate } } // Set to the updated date
      );

      console.log(`Updated date for document ${calendar._id} to ${newDate.toISOString()}.`);
    }
  } catch (error) {
    console.error('Error updating dates:', error);
  }
});
