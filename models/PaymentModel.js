import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    // required: true,
  },
  paymentType: {
    type: String,
    enum: ["Monthly_Subscription", "Lumpsum"],
    // required: true,
  },
  amount: { type: Number }, // Stores the entered money value for lumpsum or monthly subscription
  payments: [
    {
          name: {
              type: String,
            //   required: true
          }, // Payment name like GST, ESI, etc.
      isChecked: { type: Boolean, default: false },
      amount: { type: Number, default: 0 },
    },
  ],
});

const PaymentModel = mongoose.model("Payment", PaymentSchema);
export default PaymentModel;
