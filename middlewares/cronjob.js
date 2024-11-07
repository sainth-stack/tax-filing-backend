import cron from 'node-cron';
import GstFiling from '../models/AutoTaskModel.js';
import Company from '../models/companyModel.js';
import ServiceCalendarModel from '../models/ServiceCalendar.js';
import connectDB from '../config/db.js';

cron.schedule('0 0 1 * *', async () => { 
  try {
    console.log('Starting GST filing process on the 1st of the month...');

    await connectDB();

    const companies = await Company.find({});
    const now = new Date();
    const startDate = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // Fetch all service tasks
    const serviceTasks = await ServiceCalendarModel.find({}); // Fetch all service tasks, not limited to today

    // Get valid task IDs
    const validTaskIds = serviceTasks.map((task) => task.taskId);

    // Default filing data template
    const defaultFilingDataTemplate = [
      { taskId: "1", taskName: "gstMonthly", taskType: "gst", priority: "high", gstMonthly_gstType: 'gstr1' },
      { taskId: "2", taskName: "gstMonthly", taskType: "gst", priority: "high", gstMonthly_gstType: 'gstr3b' },
      { taskId: "3", taskName: "pfMonthly", taskType: "providentFund", priority: "high" },
      { taskId: "4", taskName: "tdsTcsMonthly", taskType: "tds", priority: "high" },
      { taskId: "5", taskName: "esiRegularMonthlyActivity", taskType: "esi", priority: "high" },
      { taskId: "6", taskName: "professionalTaxRegularMonthlyActivity", taskType: "professionalTax", priority: "high" },
    ];

    // Map filtered filing data with due dates from service tasks
    const filteredFilingData = defaultFilingDataTemplate
      .filter(filing => validTaskIds.includes(filing.taskName)) // Filter based on taskId
      .flatMap(filing => {
        // Get all matching service tasks for this filing
        const matchingServiceTasks = serviceTasks.filter(task => task.taskId === filing.taskName);

        // Map each matching service task to create separate filings
        return matchingServiceTasks.map(serviceTask => ({
          ...filing,
          startDate: startDate,
          dueDate: serviceTask.date.toISOString().split('T')[0], // Use due date from service task
        }));
      });

    // Loop through each company and save the filing data
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

    console.log('GST filing process on the 1st of the month completed.');
  } catch (error) {
    console.error('Error occurred during GST filing process:', error);
  }
});
