import mongoose from "mongoose";

import bcrypt from "bcryptjs";
const Schema = new mongoose.Schema(
  {
    personalInformation: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        //required: true
      },
      gender: {
        type: String,
        require: true,
      },
      dateOfBirth: {
        type: Date,
        require: true,
      },
      password: {
        type: String,
        default: bcrypt.hashSync("Test@123"),
      },
      otp: {
        type: String,
      },
      otpExpire: {
        type: Date,
      },
      token: {
        type: String,
      },
      tokenExpire: {
        type: Date,
      },
      image: String,
      profilePicture: String,
    },
    contactInformation: {
      verified: {
        type: Boolean,
        default: true,
      },
      email: {
        type: String,
        require: true,
        unique: true,
      },
      loginMethod: {
        type: String,
        enum: ["SSO", "Manual"],
        default: "Manual",
        require: true,
      },
      mobileNumber: {
        type: Number,
        require: true,
      },
      countryCode: {
        type: Number,
      },
      isSameWhatsapp: {
        type: Boolean,
        require: true,
      },
      whatsappNumber: {
        type: Number,
        require: true,
      },
      countryCode2: {
        type: Number,
      },
    },
    employmentInformation: {
      hireDate: {
        type: Date,
        require: true,
      },
      employeeNumber: {
        type: String,
        require: true,
      },
      status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active",
        require: true,
      },
      inactiveDate: {
        type: Date,
      },
      legalEntity: {
        type: String,
        require: true,
        ref: "Entity",
      },
      department: {
        type: String,
        require: true,
        ref: "Department",
      },
      designation: {
        type: String,
        require: true,
        ref: "Designation",
      },
      grade: {
        type: String,
        require: true,
        ref: "Grade",
      },
      location: {
        type: String,
        require: true,
      },
      lineManager: {
        type: String,
        require: true,
      },
      jobCategory: {
        type: String,
        require: true,
      },
      role: {
        type: String,
        enum: ["Employee", "Manager", "HR Admin", "Super Admin"],
        require: true,
      },
      departmentHead: {
        type: String,
        enum: ["Yes", "No"],
        default: "Yes",
        require: true,
      },
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    companyId: {
      type: String,
      ref: "companyModel",
    },
    freeTrail: {
      type: String,
    },
  },
  { timestamps: true }
);

export default employeeModel = mongoose.model("Employee", Schema);
