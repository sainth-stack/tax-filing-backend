import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  hireDate: {
    type: String,
  },
  role:{
    type:String
  },
  gender: {
    type: String,
  },
  status: {
    type: Boolean,
  },
  inactiveDate: {
    type: String,
  },
  email: {
    type: String,
  },
  mobileNumber: {
    type: Number,
  },
  sameAsWhatsappNumber: {
    type: Boolean,
  },
  whatsappNumber: {
    type: Number,
  },
  company: {
    type: String,
  },
  role: {
    type: String,
  },
  agency: {
    type: String,
  },
});

const User = mongoose.model("users", userSchema);

export default User;
