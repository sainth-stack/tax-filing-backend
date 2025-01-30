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
    const serviceTasks = await ServiceCalendarModel.find({}); // Fetch all service tasks, not limited to today
    const validTaskIds = serviceTasks.map((task) => task.taskId);

    const defaultFilingDataTemplate = [
      { taskId: "gstMonthly-gstr1", taskName: "gstMonthly", taskType: "gst", priority: "high", gstMonthly_gstType: 'gstr1' },
      { taskId: "gstMonthly-gstr3b", taskName: "gstMonthly", taskType: "gst", priority: "high", gstMonthly_gstType: 'gstr3b' },
      { taskId: "pfMonthly", taskName: "pfMonthly", taskType: "providentFund", priority: "high" },
      { taskId: "tdsTcsMonthly", taskName: "tdsTcsMonthly", taskType: "tds", priority: "high" },
      { taskId: "esiRegularMonthlyActivity", taskName: "esiRegularMonthlyActivity", taskType: "esi", priority: "high" },
      { taskId: "professionalTaxRegularMonthlyActivity", taskName: "professionalTaxRegularMonthlyActivity", taskType: "professionalTax", priority: "high" },
    ];

    // Map filtered filing data with due dates from service tasks
    const filteredFilingData = defaultFilingDataTemplate
      .filter(filing => validTaskIds.includes(filing.taskId)) // Filter based on taskId
      .flatMap(filing => {
        // Get all matching service tasks for this filing
        const matchingServiceTasks = serviceTasks.filter(task => task.taskId === filing.taskId);

        // Map each matching service task to create separate filings
        return matchingServiceTasks.map(serviceTask => ({
          ...filing,
          startDate: startDate,
          dueDate: serviceTask.date.toISOString().split('T')[0], // Use due date from service task
        }));
      });

    // Loop through each company and save the filing data
    for (const company of companies) {
      // Filter filing data based on active services in the company
      const FilingData = filteredFilingData.filter(filing => {
        // Check the status of the corresponding service
        switch (filing.taskType) {
          case 'gst':
            return company.gst?.status?.toLowerCase() === 'active';
          case 'providentFund':
            return company.providentFund?.status?.toLowerCase() === 'active';
          case 'tds':
            return company.tds?.status?.toLowerCase() === 'active';
          case 'esi':
            return company.esi?.status?.toLowerCase() === 'active';
          case 'professionalTax':
            return company.professionalTax?.status?.toLowerCase() === 'active';
          default:
            return false;
        }
      });
      const companyFilingData = FilingData.map(filing => ({
        ...filing,
        company: company.companyDetails.companyName,
        agencyName: company?.companyDetails?.agencyName,
      }))

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
