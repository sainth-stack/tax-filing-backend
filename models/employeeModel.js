import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  password: {
    type: String,
  },
  hireDate: {
    type: String,
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
    required: true,
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

 
  company: [{
    _id: {
      type: String,
    },
    label: {
      type: String,
    },
    value: {
      type: String,
    }
  }],
  role: {
    type: String,
  },
  agency: {
    type: String,
  },
});

const User = mongoose.model("users", userSchema);

export default User;
