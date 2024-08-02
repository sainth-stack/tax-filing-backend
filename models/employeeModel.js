import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const Schema = new mongoose.Schema(
  {
    personalInformation: {
      firstName: {
        type: String,
        // //required: true,
      },
      lastName: {
        type: String,
        // //required: true,
      },
      gender: {
        type: String,
        //required: true,
      },
      dateOfBirth: {
        type: Date,
        //required: true,
      },
      password: {
        type: String,
        default: bcrypt.hashSync("Test@123"),
        // //required: true, // Uncomment if password is required
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
        //required: true,
        unique: true,
        lowercase: true,
      },
      loginMethod: {
        type: String,
        enum: ["SSO", "Manual"],
        default: "Manual",
        //required: true,
      },
      mobileNumber: {
        type: String, // Changed to String for consistency with phone format
        //required: true,
      },
      countryCode: {
        type: Number,
      },
      isSameWhatsapp: {
        type: Boolean,
        //required: true,
      },
      whatsappNumber: {
        type: String, // Changed to String for consistency with phone format
        //required: true,
      },
      countryCode2: {
        type: Number,
      },
    },
    employmentInformation: {
      hireDate: {
        type: Date,
        //required: true,
      },
      employeeNumber: {
        type: String,
        //required: true,
      },
      status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active",
        //required: true,
      },
      inactiveDate: {
        type: Date,
      },
      legalEntity: {
        type: String,
        //required: true,
        ref: "Entity",
      },
      department: {
        type: String,
        //required: true,
        ref: "Department",
      },
      designation: {
        type: String,
        //required: true,
        ref: "Designation",
      },
      grade: {
        type: String,
        //required: true,
        ref: "Grade",
      },
      location: {
        type: String,
        //required: true,
      },
      lineManager: {
        type: String,
        //required: true,
      },
      jobCategory: {
        type: String,
        //required: true,
      },
      role: {
        type: String,
        enum: ["Employee", "Manager", "HR Admin", "Super Admin"],
        //required: true,
      },
      departmentHead: {
        type: String,
        enum: ["Yes", "No"],
        default: "Yes",
        //required: true,
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
    name: {
      type: String,
      //required: true,
    },
    image: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      //required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false,
    },
    verified: {
      type: Boolean,
      default: true,
    },
    emailSignup: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      required: false,
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
  },
  { timestamps: true }
);

const employeeModel = mongoose.model("Employee", Schema);
export default employeeModel;
