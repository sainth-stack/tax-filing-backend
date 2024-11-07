import cron from 'node-cron';
import GstFiling from '../models/taskModel.js'; // Ensure your model path is correct
import Company from '../models/companyModel.js'; // Assuming you have a company model
import connectDB from '../config/db.js';

cron.schedule('0 6 * * *', async () => { // Run at 6 AM every day
    try {
        console.log('GST Inactive Priority Status Updating.');

        await connectDB();
        const currentDate = new Date();

        // Find all tasks where taskName is 'gstInactive'
        const tasks = await GstFiling.find({ taskName: 'gstInactive' });
        for (const task of tasks) {
            const approvalDate = new Date(task?.gstInactive_dateOfApproval); // Use the new key for approval date
            const finalReturnStatus = task?.gstInactive_finalReturnStatus; // Use the new key for final return status

            // Calculate the dates for priority updates
            const sixtyDaysLater = new Date(approvalDate);
            sixtyDaysLater.setDate(approvalDate.getDate() + 60);

            const oneMonthLater = new Date(approvalDate);
            oneMonthLater.setMonth(approvalDate.getMonth() + 1);

            // Determine priority based on approval period
            if (currentDate > sixtyDaysLater && finalReturnStatus !== 'filed') {
                task.priority = 'High';
            } else if (currentDate > oneMonthLater && currentDate <= sixtyDaysLater && finalReturnStatus !== 'filed') {
                task.priority = 'Medium';
            } else if (currentDate <= oneMonthLater && finalReturnStatus !== 'filed') {
                task.priority = 'Low';
            }

            await task.save();

            if (finalReturnStatus === 'Final Return Done') {
                const company = await Company.findById(task.companyId); // Ensure task has companyId field
                if (company) {
                    company.gstService = 'Inactive'; // Update accordingly
                    company.effectiveDate = currentDate; // Set the effective date to the current date
                    await company.save();
                }
            }
        }

        console.log('GST Inactive Priority Status Updated.');
    } catch (error) {
        console.error('Error occurred during GST filing process:', error);
    }
});
