import PaymentModel from "../models/PaymentModel.js";
import companyModel from './../models/companyModel.js';




export const getAllPayments = async (req, res) => {
  try {
    const payments = await PaymentModel.find().populate("companyId"); // Fetch payments and populate company details

    // Transform data to send company details separately
    const formattedPayments = payments.map((payment) => ({
      _id: payment._id,
      company: payment.companyId?.companyDetails?.companyName || "N/A", // Send company details directly
      paymentType: payment.paymentType,
      amount: payment.amount,
      payments: payment.payments,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    }));

    res.status(200).json({
      success: true,
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
    const { company, taskType, feeType, amount, payments } = req.body;

    // Fetch companyId based on company name
    const companyData = await companyModel.findOne({
      "companyDetails.companyName": company,
    });

    if (!companyData) {
      return res.status(400).json({ message: "Company not found" });
    }

    // Convert feeType to match schema
    const paymentType =
      feeType === "monthlySubscription" ? "Monthly_Subscription" : "Lumpsum";

    let finalPayments = [];
    let totalAmount = 0;

    if (feeType == "lumpsum") {
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
      paymentType,
      amount: totalAmount,
      payments: finalPayments,
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


// Update Payment
export const updatePayment = async (req, res) => {
  try {
    const { companyId, paymentType, amount, payments } = req.body;

    if (!companyId) {
      return res.status(400).json({ message: "Company ID is required" });
    }

    let updatedPayments = [];
    let totalAmount = 0;

    if (paymentType == "lumpsum") {
      // Use provided amount and payments directly for lumpsum
      totalAmount = Number(amount);
      updatedPayments = payments.map((payment) => ({
        name: payment.name,
        isChecked: payment.isChecked,
        amount: Number(payment.amount),
      }));
    } else {
      // Process payments dynamically for "Monthly_Subscription"
      updatedPayments = Object.entries(req.body)
        .filter(([key]) => key.startsWith("amount_"))
        .map(([key, value]) => ({
          name: key.replace("amount_", ""), // Extracting payment name
          isChecked: true,
          amount: Number(value),
        }));

      // Calculate total amount
      totalAmount = updatedPayments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );
    }

    const updatedPayment = await PaymentModel.findOneAndUpdate(
      { companyId },
      { paymentType, amount: totalAmount, payments: updatedPayments },
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({
      message: "Payment updated successfully",
      payment: updatedPayment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating payment", error: error.message });
  }
};


// Get Payment by Company
export const getPaymentsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const payment = await PaymentModel.findOne({ companyId });

    if (!payment)
      return res
        .status(404)
        .send({ message: "No payment found for this company" });

    res.status(200).json(payment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving payments", error: error.message });
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

