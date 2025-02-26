import manualTaskModel from "../models/taskModel.js";
import PaymentModel from "../models/PaymentModel.js";
import ServiceCalendarModel from '../models/ServiceCalendar.js';

const taskData = [
    { "taskName": "gst", "subTasks": ["gstr1", "gstr3b"] },
    { "taskName": "providentFund", "subTasks": ["pfMonthly"] },
    { "taskName": "tds", "subTasks": ["tdsTcsMonthly"] },
    { "taskName": "esi", "subTasks": ["esiRegularMonthlyActivity"] },
    { "taskName": "professionalTax", "subTasks": ["professionalTaxRegularMonthlyActivity"] }
];

export const CreatePaymentTask = async (data) => {
    const { company, taskType,agencyName } = data;
    const isTaskCompleted = checkTaskCompletion(data);
    if (!isTaskCompleted) {
        console.log("Task is not completed yet.");
        return;
    }

    const paymentDetails = await PaymentModel.find({ company: company });
    if (!paymentDetails || paymentDetails.length === 0) {
        console.log("No payment details found for the company.");
        return;
    }
    for (const payment of paymentDetails) {
        const {amount } = payment;
        const allSubtasksCompleted = await checkAllSubtasksCompleted(data, taskType);
        if (allSubtasksCompleted) {
            await createPaymentTask(company, taskType, amount,agencyName);
            console.log("Monthly payment task created.");
        }
    }
};

const checkTaskCompletion = (data) => {
    const { taskType, gstMonthly_filedate, pfMonthly_filedate, esi_fileDate, pft_fileDate, tax_filingDate, tdsmonthly_paidDate } = data;

    return (
        (taskType === "gst" && gstMonthly_filedate) ||
        (taskType === "providentFund" && pfMonthly_filedate) ||
        (taskType === "esi" && esi_fileDate) ||
        (taskType === "professionalTax" && pft_fileDate) ||
        (taskType === "incomeTax" && tax_filingDate) ||
        (taskType === "tds" && tdsmonthly_paidDate)
    );
};

const checkAllSubtasksCompleted = async (data, taskType) => {
    const task = taskData.find(t => t.taskName === taskType);
if (!task) return false;
const finaltasks= await manualTaskModel.find({agencyName:data.agencyName,company:data.company,taskType:taskType})
const completedtasks=finaltasks.filter(task=>checkTaskCompletion(task))
return completedtasks.length===task?.subTasks?.length
};

const createPaymentTask = async (company, taskName, amount,agencyName) => {
    const now = new Date();
    const startDate = now.toISOString().split('T')[0];
    const serviceTasks = await ServiceCalendarModel.find({});
    const validTaskIds = serviceTasks.filter((task) => taskName ==="gst"? task.taskId.includes("gstMonthly-gstr3b") :task.taskId.includes(taskName));
    console.log(validTaskIds,'validTaskIds');
    const paymentTask = new manualTaskModel({
        company: company,
        taskName: "paymentcollection",
        taskType: taskName,
        amount: amount,
        startDate: startDate,
        dueDate: validTaskIds[0].date.toISOString().split('T')[0],
        paymentstatus: "pending",
        priority:'high',
        agencyName:agencyName
    });

    await paymentTask.save();
};