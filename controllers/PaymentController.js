import PaymentModel from "../models/PaymentModel.js";


// Create Payment
export const createPayment = async (req, res) => {
  try {
    const { companyId, paymentType, amount, payments } = req.body;

    const newPayment = await PaymentModel.create({
      companyId,
      paymentType,
      amount,
      payments,
    });
    res
      .status(201)
      .send({ message: "Payment created successfully", payment: newPayment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating payment", error: error.message });
  }
};

// Update Payment
export const updatePayment = async (req, res) => {
  try {
    const { companyId, paymentType, amount, payments } = req.body;

    const updatedPayment = await PaymentModel.findOneAndUpdate(
      { companyId },
      { paymentType, amount, payments },
      { new: true }
    );

    if (!updatedPayment)
      return res.status(404).send({ message: "Payment not found" });

    res
      .status(200)
      .json({
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
