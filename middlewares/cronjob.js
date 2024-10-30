import cron from 'node-cron';
import GstFiling from '../models/AutoTaskModel.js';
import Company from '../models/companyModel.js';
import ServiceCalendarModel from '../models/ServiceCalendar.js';
import connectDB from '../config/db.js';

cron.schedule('0 6 * * *', async () => {
  try {
    console.log('Starting GST filing process at 6 AM...');

    await connectDB();

    const companies = await Company.find({});
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    const serviceTasks = await ServiceCalendarModel.find({
      date: new Date(today),
    });

    const validTaskIds = serviceTasks.map((task) => task.taskId);

    const defaultFilingDataTemplate = [
      { taskId: "1", taskName: "gstMonthly", taskType: "gst", priority: "high" },
      { taskId: "2", taskName: "gstMonthlyPayment", taskType: "gst", priority: "high" },
      { taskId: "3", taskName: "pfMonthly", taskType: "providentFund", priority: "high" },
      { taskId: "4", taskName: "tdsTcsMonthly", taskType: "tds", priority: "high" },
      { taskId: "5", taskName: "esiRegularMonthlyActivity", taskType: "esi", priority: "high" },
      { taskId: "6", taskName: "professionalTaxRegularMonthlyActivity", taskType: "professionalTax", priority: "high" },
    ];

    // Start date is today, and due date is 5 days after today
    const startDate = new Date(now);
    const dueDate = new Date(now);
    dueDate.setDate(startDate.getDate() + 5); // Add 5 days to the current date

    // Filter filing data to include only tasks whose taskIds are in `validTaskIds`
    const filteredFilingData = defaultFilingDataTemplate.filter(filing =>
      validTaskIds.includes(filing.taskName)
    ).map(filing => ({
      ...filing,
      startDate: startDate.toISOString().split('T')[0], // YYYY-MM-DD
      dueDate: dueDate.toISOString().split('T')[0],     // YYYY-MM-DD
    }));

    // Create a GST filing for each company based on the filtered tasks
    for (const company of companies) {
      const companyFilingData = filteredFilingData.map(filing => ({
        ...filing,
        company: company.companyDetails.companyName,
      }));

      for (const filingData of companyFilingData) {
        const newFiling = new GstFiling(filingData);
        await newFiling.save();
      }
    }

    console.log('GST filing process at 6 AM completed.');
  } catch (error) {
    console.error('Error occurred during GST filing process:', error);
  }
});
