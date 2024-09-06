import cron from 'node-cron';
import mongoose from 'mongoose';
import GstFiling from '../models/taskModel.js';
import Company from '../models/companyModel.js';
import connectDB from '../config/db.js';

cron.schedule('0 0 1 * *', async () => {
  try {
    console.log('Starting GST filing process every 10 minutes...');

    await connectDB();

    const companies = await Company.find({});

    const now = new Date();

    const startDate = new Date(now.getFullYear(), now.getMonth(), 2);
    const dueDate = new Date(now.getFullYear(), now.getMonth(), 6);

    const defaultFilingDataTemplate = [
      {
        priority: "high",
        startDate: startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        dueDate: dueDate.toISOString().split('T')[0],     // Format as YYYY-MM-DD
        taskType: "gst",
        taskName: "gstMonthly"
      },
      {
        priority: "high",
        startDate: startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        dueDate: dueDate.toISOString().split('T')[0],     // Format as YYYY-MM-DD
        taskType: "gst",
        taskName: "gstMonthlyPayment"
      },
      {
        priority: "high",
        startDate: startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        dueDate: dueDate.toISOString().split('T')[0],     // Format as YYYY-MM-DD
        taskType: "providentFund",
        taskName: "pfMonthly"
      },
      {
        priority: "high",
        startDate: startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        dueDate: dueDate.toISOString().split('T')[0],     // Format as YYYY-MM-DD
        taskType: "tds",
        taskName: "tdsTcsMonthly"
      },
      {
        priority: "high",
        startDate: startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        dueDate: dueDate.toISOString().split('T')[0],     // Format as YYYY-MM-DD
        taskType: "esi",
        taskName: "esiRegularMonthlyActivity"
      },
      {
        priority: "high",
        startDate: startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        dueDate: dueDate.toISOString().split('T')[0],     // Format as YYYY-MM-DD
        taskType: "professionalTax",
        taskName: "professionalTaxRegularMonthlyActivity"
      }
    ];

    // Create a GST filing for each company
    for (const company of companies) {
      const companyFilingData = defaultFilingDataTemplate.map(filing => ({
        ...filing,
        company: company.companyDetails.companyName,
      }));

      for (const filingData of companyFilingData) {
        const newFiling = new GstFiling(filingData);
        await newFiling.save();
      }
    }

    console.log('GST filing process every 10 minutes completed.');
  } catch (error) {
    console.error('Error occurred during GST filing process:', error);
  }
});
