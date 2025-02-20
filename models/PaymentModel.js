import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    // required: true,
  },
  paymentType: {
    type: String,
    // required: true,
  },
  amount: {
    type: Number,
    default:0
    // required: true
  }, // Total amount for the payment type
  payments: [
    {
      name: {
        type: String,
        // required: true
      }, // Payment category (e.g., GST, ESI)
      isChecked: {
        type: Boolean,
        default: false
      }, // Always true since it's provided
      amount: {
        type: Number,
        // required: true
      }, // Individual payment amounts
    },
  ],
});

const PaymentModel = mongoose.model("Payment", PaymentSchema);
export default PaymentModel;





