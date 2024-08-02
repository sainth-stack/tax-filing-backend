import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import employeeModel from "./../models/employeeModel.js";

import nodemailer from "nodemailer";
import sendgridTransport from "nodemailer-sendgrid-transport";
import { signToken } from "../config/auth.js";

export const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

function generateRandomNumber(n) {
  return (
    Math.floor(Math.random() * (9 * Math.pow(10, n - 1))) + Math.pow(10, n - 1)
  );
}

export const loginUser = async (req, res) => {
  const user = await employeeModel.findOne({
    "contactInformation.email": req.body.email,
  });

  if (user) {
    const isActive = await employeeModel.findOne({
      "contactInformation.email": req.body.email,
      "employmentInformation.status": "Active",
    });

    if (isActive) {
      if (
        req.body.password === "FreeTrail" ||
        bcrypt.compareSync(req.body.password, user.personalInformation.password)
      ) {
        const token = signToken(user);
        res.send({
          token,
          _id: user._id,
          name: `${user.personalInformation.firstName} ${user.personalInformation.lastName}`,
          email: user.contactInformation.email,
          mobileNumber: user.contactInformation.mobileNumber,
          image: user.personalInformation.image,
          role: user.employmentInformation.role,
          department: user.employmentInformation.department,
          company: user.employmentInformation.legalEntity,
          profilePicture: user.personalInformation.profilePicture,
          lineManager: user.employmentInformation.lineManager,
          freeTrail: user.freeTrail,
          companyId: user.companyId,
        });
      } else {
        res.status(401).send({
          message: "Invalid Password",
        });
      }
    } else {
      res.status(401).send({
        message: "Your Account Is Not Verified",
      });
    }
  } else {
    res.status(401).send({
      message: "Invalid Email",
    });
  }
};

export const loginMicrosoftUser = async (req, res) => {
  const user = await employeeModel.findOne({
    "contactInformation.email": req.body.email,
  });

  if (user) {
    const isActive = await employeeModel.findOne({
      "contactInformation.email": req.body.email,
      "employmentInformation.status": "Active",
    });

    const token = signToken(user);
    if (isActive) {
      res.send({
        token,
        _id: user._id,
        name: `${user.personalInformation.firstName} ${user.personalInformation.lastName}`,
        email: user.contactInformation.email,
        mobileNumber: user.contactInformation.mobileNumber,
        image: user.personalInformation.image,
        role: user.employmentInformation.role,
        department: user.employmentInformation.department,
        company: user.employmentInformation.legalEntity,
        profilePicture: user.personalInformation.profilePicture,
        lineManager: user.employmentInformation.lineManager,
        freeTrail: user.freeTrail,
        companyId: user.companyId,
      });
    } else {
      res.status(401).send({
        message: "Your Account Is Not Verified",
      });
    }
  } else {
    res.status(401).send({
      message: "Invalid Email",
    });
  }
};

export const changePassword = async (req, res) => {
  const user = await employeeModel.findOne({
    "contactInformation.email": req.body.email,
  });

  if (!user.personalInformation.password) {
    res.status(200).send({
      message:
        "For change password, you need to sign in with email & password!",
    });
  } else if (
    user &&
    bcrypt.compareSync(
      req.body.currentPassword,
      user.personalInformation.password
    )
  ) {
    user.personalInformation.password = bcrypt.hashSync(req.body.newPassword);
    await user.save();
    res.status(200).send({
      message: "Your password has been changed successfully!",
    });
  } else {
    res.status(401).send({
      message: "Invalid email or current password!",
    });
  }
};

export const signUpWithProvider = async (req, res) => {
  try {
    const existingUser = await employeeModel.findOne({
      "contactInformation.email": req.body.email,
    });

    if (existingUser) {
      const token = signToken(existingUser);
      res.send({
        token,
        _id: existingUser._id,
        name:
          existingUser.personalInformation.firstName +
          " " +
          existingUser.personalInformation.lastName,
        email: existingUser.contactInformation.email,
        address: existingUser.address,
        phone: existingUser.phone,
        image: existingUser.personalInformation.image,
        role: existingUser.employmentInformation.role,
      });
    } else {
      const newUser = new employeeModel({
        personalInformation: {
          firstName: req.body.name.split(" ")[0],
          lastName: req.body.name.split(" ").slice(1).join(" "),
          image: req.body.image,
          password: bcrypt.hashSync("Test@123"),
        },
        contactInformation: {
          email: req.body.email,
          emailSignup: req.body.emailSignup || false,
        },
        employmentInformation: {
          role: req.body.role,
        },
      });

      const user = await newUser.save();
      const token = signToken(user);
      res.send({
        token,
        _id: user._id,
        name: `${user.personalInformation.firstName} ${user.personalInformation.lastName}`,
        email: user.contactInformation.email,
        image: user.personalInformation.image,
        role: user.employmentInformation.role,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await employeeModel.find({}).sort({ _id: -1 });
    res.send(users);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await employeeModel.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(user);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updatedUser = await employeeModel.findByIdAndUpdate(
      req.params.id,
      {
        personalInformation: {
          ...req.body.personalInformation,
          password: req.body.personalInformation.password
            ? bcrypt.hashSync(req.body.personalInformation.password)
            : undefined,
        },
        contactInformation: req.body.contactInformation,
        employmentInformation: req.body.employmentInformation,
        companyId: req.body.companyId,
        freeTrail: req.body.freeTrail,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(updatedUser);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await employeeModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const user = await employeeModel.findOne({
      "contactInformation.email": req.body.email,
      otp: req.body.otp,
      otpExpire: { $gt: Date.now() },
    });

    if (user) {
      user.personalInformation.otp = null;
      user.personalInformation.otpExpire = null;
      user.employmentInformation.status = "Active";
      await user.save();
      res.status(200).send({
        message: "Your account has been activated!",
      });
    } else {
      res.status(401).send({
        message: "Invalid or expired OTP!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

export const forgotpassword = async (req, res) => {
  try {
    const user = await employeeModel.findOne({
      "contactInformation.email": req.body.email,
    });

    if (user) {
      const otp = generateRandomNumber(6);
      user.personalInformation.otp = otp;
      user.personalInformation.otpExpire = Date.now() + 3600 * 1000;
      await user.save();

      await transporter.sendMail({
        to: user.contactInformation.email,
        from: process.env.EMAIL_FROM,
        subject: "Password Reset OTP",
        html: `<p>Your OTP for password reset is ${otp}. It is valid for 1 hour.</p>`,
      });

      res.status(200).send({
        message: "OTP sent to your email!",
      });
    } else {
      res.status(401).send({
        message: "Invalid email address!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

export const resetpassword = async (req, res) => {
  try {
    const user = await employeeModel.findOne({
      "contactInformation.email": req.body.email,
      "personalInformation.otp": req.body.otp,
      "personalInformation.otpExpire": { $gt: Date.now() },
    });

    if (user) {
      user.personalInformation.password = bcrypt.hashSync(req.body.newPassword);
      user.personalInformation.otp = null;
      user.personalInformation.otpExpire = null;
      await user.save();
      res.status(200).send({
        message: "Password reset successfully!",
      });
    } else {
      res.status(401).send({
        message: "Invalid or expired OTP!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

export const loginMicorsoftUser = async (req, res) => {
  // #swagger.tags = ['User Management']
  const user = await employeeModel.findOne({
    "contactInformation.email": req.body.email,
  });
  if (user) {
    const user2 = await employeeModel.findOne({
      "contactInformation.email": req.body.email,
      "employmentInformation.status": "Active",
    });
    const token = signToken(user);
    if (user2) {
      res.send({
        token,
        _id: user._id,
        name:
          user.personalInformation.firstName +
          " " +
          user.personalInformation.lastName,
        firstName: user.personalInformation.firstName,
        email: user.contactInformation.email,
        mobileNumber: user.contactInformation.mobileNumber,
        image: user.personalInformation.image,
        role: user.employmentInformation.role,
        department: user.employmentInformation.department,
        company: user.employmentInformation.legalEntity,
        profilePicture: user.personalInformation.profilePicture,
        lineManager: user.employmentInformation.lineManager,
        freeTrail: user.freeTrail,
        companyId: user.companyId,
      });
    } else {
      res.status(401).send({
        message: "Your Account Is Not Verified",
      });
    }
  } else {
    res.status(401).send({
      message: "Invalid Email",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.send({
      message: "Logged out successfully",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
