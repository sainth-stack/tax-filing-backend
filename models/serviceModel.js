// models/Service.js
import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
  },
  status: {
    type: String,
  },
  effectiveFrom: {
    type: Date,
  },
  effectiveTo: {
    type: Date,
  },
});

const serviceModel = mongoose.model("service", serviceSchema);

export default serviceModel;
