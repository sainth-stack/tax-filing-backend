import PaymentModel from "../models/PaymentModel.js";
import companyModel from './../models/companyModel.js';
import AutoTaskModel from './../models/AutoTaskModel.js';
import ManualTaskModel from './../models/taskModel.js';

export const getAllPayments = async (req, res) => {
  try {
    const { agencyName, page = 1, pageSize = 10 } = req.query;

    // Convert page and pageSize to numbers
    const limit = parseInt(pageSize);
    const skip = (parseInt(page) - 1) * limit;

    // Count total payments
    const totalPayments = await PaymentModel.countDocuments({
      "companyDetails.agencyName": agencyName,
    });

    // Fetch paginated payments
    const payments = await PaymentModel.find({
      "companyDetails.agencyName": agencyName,
    })
      .populate("companyId")
      .skip(skip)
      .limit(limit);

    // console.log("Payments:", payments);

    // Transform data
    const formattedPayments = payments.map((payment) => ({
      _id: payment._id,
      company: payment.companyId?.companyDetails?.companyName || "N/A",
      paymentType: payment.paymentType,
      amount: payment.amount,
      payments: payment.payments,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      agencyName: payment.companyId?.companyDetails?.companyName,
    }));

    res.status(200).json({
      success: true,
      totalPayments, // Include total count
      data: formattedPayments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: error.message,
    });
  }
};




// Create Payment
export const createPayment = async (req, res) => {
  try {
    const { company, taskType, paymentType, amount, payments ,agencyName} = req.body;

    // Fetch companyId based on company name
    const companyData = await companyModel.findOne({
      "_id": company,
    });

    console.log("companyData", companyData)

    if (!companyData) {
      return res.status(400).json({ message: "Company not found" });
    }
    
 const companyName =
      companyData.companyDetails?.companyName || "Unknown Company";
    
    // Convert paymentType to match schema
    const paymentTypeCheck =
      paymentType === "monthlySubscription" ? "monthlySubscription" : "lumpsum";

    let finalPayments = [];
    let totalAmount = 0;

    if (paymentTypeCheck == "lumpsum") {
      // Use provided amount directly for lumpsum payments
      totalAmount = Number(amount);
      finalPayments = payments.map((payment) => ({
        name: payment.name,
        isChecked: payment.isChecked,
        amount: Number(payment.amount),
      }));
    } else {
      // Process payments dynamically for "monthlySubscription"
      finalPayments = Object.entries(req.body)
        .filter(([key]) => key.startsWith("amount_"))
        .map(([key, value]) => ({
          name: key.replace("amount_", ""), // Extracting payment name
          isChecked: true,
          amount: Number(value),
        }));

      // Calculate the total amount
      totalAmount = finalPayments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );
    }

    // Create new payment document
    const newPayment = new PaymentModel({
      companyId: companyData._id,
      company: companyName,
      paymentType,
      amount: totalAmount,
      payments: finalPayments,
      agencyName,
    });

    await newPayment.save();
    res
      .status(201)
      .json({ message: "Payment created successfully", newPayment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// Import CompanyModel

export const updatePayment = async (req, res) => {
  try {
    const paymentId = req.params.id; // Extract paymentId from URL
    // console.log("Updating payment with ID:", paymentId);



    if (!paymentId) {
      return res
        .status(400)
        .json({ success: false, message: "Payment ID is required" });
    }

    // Fetch existing payment record
    const existingPayment = await PaymentModel.findById(paymentId);
    if (!existingPayment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });
    }

    // Extract request data
    const { company, paymentType, amount, payments, agencyName } = req.body;

    console.log(
      "node paymetn update deails{ company, paymentType, amount, payments, agencyName }  ",
      company,
      paymentType,
      amount,
      payments,
      agencyName
    );

    let companyId = existingPayment.companyId; // Default to existing companyId

    // If company name is provided, fetch companyId from CompanyModel
    if (company) {
      const companyData = await companyModel.findOne({
        "companyDetails.companyName": company,
      });
      if (!companyData) {
        return res
          .status(400)
          .json({ success: false, message: "Company not found" });
      }
      companyId = companyData._id; // Use the found companyId
    }

    let updatedPayments = [];
    let totalAmount = 0;

    if (paymentType === "lumpsum") {
      if (!amount || isNaN(Number(amount))) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Valid amount is required for lumpsum",
          });
      }
      if (!Array.isArray(payments) || payments.length === 0) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Payments array is required for lumpsum",
          });
      }

      totalAmount = Number(amount);
      updatedPayments = payments.map((payment) => ({
        name: payment.name,
        isChecked: payment.isChecked || false,
        amount: Number(payment.amount) || 0,
      }));
    } else {
      updatedPayments = Object.entries(req.body)
        .filter(([key]) => key.startsWith("amount_"))
        .map(([key, value]) => ({
          name: key.replace("amount_", ""),
          isChecked: true,
          amount: Number(value) || 0,
        }));

      if (updatedPayments.length === 0) {
        return res.status(400).json({
          success: false,
          message:
            "At least one payment amount is required for non-lumpsum type",
        });
      }

      totalAmount = updatedPayments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );
    }

    // Update payment record in DB
    const updatedPayment = await PaymentModel.findByIdAndUpdate(
      paymentId,
      {
        companyId,
        company, // Store company name in the document
        paymentType,
        amount: totalAmount,
        payments: updatedPayments,
        agencyName,
      },
      { new: true } // Return updated document
    );

    res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      payment: updatedPayment,
    });
  } catch (error) {
    console.error("Error updating payment:", error.message);
    res.status(500).json({
      success: false,
      message: "Error updating payment",
      error: error.message,
    });
  }
};





// Get Payment by Company
export const getCompanyByAgency = async (req, res) => {
  try {
   

    const  {agencyName}  = req.query;
    if (!agencyName) {
      return res.status(400).json({ message: "Agency name is required" });
    }

    const payment = await PaymentModel.find({ agencyName });

    if (!payment) {
      return res
        .status(404)
        .json({ message: "No payment found for this company" });
    }

    res.status(200).send({
      data: payment,
      totalPayments:payment.length
    });
  } catch (error) {
    console.error("Server Error:", error);
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

export const deletePaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPayment = await PaymentModel.findByIdAndDelete(id);

    if (!deletedPayment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Payment deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};



export const getPaymentByID = async (req, res) => {
  // console.log("🔹 Route hit: GET /payments/:paymentId");
  // console.log("📌 Full request params:", req.params.paymentId);

  const paymentId = req.params.paymentId;
  // console.log("📌 Extracted paymentId:", paymentId);

  if (!paymentId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing payment ID" });
  }

  try {
    const payment = await PaymentModel.findById(paymentId)

    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });
    }

    // console.log("payemts by Id",payment)
    return res.status(200).json({ success: true, data: payment });
  } catch (error) {
    // console.error("❌ Error fetching payment:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getPaymentsByAgency = async (req, res) => {
  try {
    const { agencyName } = req.query;
    if (!agencyName) {
      return res.status(400).json({ message: "Agency name is required" });
    }
    const autotasks=await AutoTaskModel.find({agencyName:agencyName,taskName:"paymentcollection"})
    const manualtasks=await ManualTaskModel.find({agencyName:agencyName,taskName:"paymentcollection"})
    const payments=await PaymentModel.find({agencyName:agencyName})
    const tasks=[...autotasks,...manualtasks]
let pendingAmount=0;
let completedAmount=0;
payments.map((payment)=>{
  const groupTasks=tasks.filter((item)=>item?.company == payment.company)
  if(groupTasks.length>0){
    if(payment.paymentType=="monthlySubscription"){
      groupTasks.map((task)=>{
        const amount=payment.payments.find((item)=>item?.name==task?.taskType)
        if(task?.paymentstatus=="pending"){
          pendingAmount=pendingAmount+amount?.amount
        } else{
          completedAmount=completedAmount+amount?.amount
        }
      })
    } else{
      const paymentCollection=groupTasks.filter((item)=>item.paymentstatus !=="pending")
      if(groupTasks.length !== paymentCollection.length){
        pendingAmount=pendingAmount+payment.amount
      } else{
        completedAmount=completedAmount+payment.amount
      }
    }
  }
})
    return res.status(200).json({ pendingAmount,completedAmount });

}
   catch (error) {
    console.error("Error fetching payment by company:", error);
     res.status(500).json({ success: false, message: "Server error" });
  }
};
