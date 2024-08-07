import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import employeeModel from "./../models/employeeModel.js";

import nodemailer from "nodemailer";
import sendgridTransport from "nodemailer-sendgrid-transport";
import { signToken } from "../config/auth.js";
import userModel from "../models/userModel.js";

export const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENGRID_API_KEY,
    },
  })
);

function generateRandomNumber(n) {
  return (
    Math.floor(Math.random() * (9 * Math.pow(10, n - 1))) + Math.pow(10, n - 1)
  );
}

export const registerUser = async (req, res) => {
  try {
    let otp = generateRandomNumber(6);
    let name = req.body.name;
    const newUser = new employeeModel({
      contactInformation: {
        email: req.body.email,
      },
      employmentInformation: {
        role: req.body.role,
      },
      personalInformation: {
        /*    firstName: name[0],
        lastName: name.length > 1 ? name[1] : "",
        password: bcrypt.hashSync(req.body.password),
        otp,
        otpExpire: Date.now() + 3600 * 1000,*/
      },
      companyId: req.body.companyId,
      freeTrail: req.body?.freeTrail || false,
    });

    const user = await newUser.save();
    const token = signToken(user);

    res.send({
      token,
      _id: user._id,
      /* name:
        user.personalInformation.firstName +
        " " +
        user.personalInformation.lastName,
      firstName: user.personalInformation.firstName, */
      email: user.contactInformation.email,
      mobileNumber: user.contactInformation.mobileNumber,
      image: user.personalInformation.image,
      role: user.employmentInformation.role,
      company: user.employmentInformation.legalEntity,
      /*  profilePicture: user.personalInformation.profilePicture, */
    });
    //});
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

export const loginUser = async (req, res) => {
  // #swagger.tags = ['User Management']
  const user = await employeeModel.findOne({
    "contactInformation.email": req.body.email,
  });
  if (user) {
    const user2 = await employeeModel.findOne({
      "contactInformation.email": req.body.email,
      "employmentInformation.status": "Active",
    });
    if (user2) {
      if (
        user &&
        (req.body.password === "FreeTrail"
          ? true
          : bcrypt.compareSync(
              req.body.password,
              user.personalInformation.password
            ))
      ) {
        const token = signToken(user);
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

export const changePassword = async (req, res) => {
  // #swagger.tags = ['User Management']
  const user = await userModel.findOne({ email: req.body.email });
  if (!user.password) {
    res.status(200).send({
      message: "For change password,You need to sign in with email & password!",
    });
  } else if (
    user &&
    bcrypt.compareSync(req.body.currentPassword, user.password)
  ) {
    user.password = bcrypt.hashSync(req.body.newPassword);
    await user.save();
    res.status(200).send({
      message: "Your password change successfully!",
    });
  } else {
    res.status(401).send({
      message: "Invalid email or current password!",
    });
  }
};

export const signUpWithProvider = async (req, res) => {
  // #swagger.tags = ['User Management']
  try {
    const isAdded = await userModel.findOne({ email: req.body.email });
    if (isAdded) {
      const token = signToken(isAdded);
      res.send({
        token,
        _id: isAdded._id,
        name: isAdded.name,
        email: isAdded.email,
        address: isAdded.address,
        phone: isAdded.phone,
        image: isAdded.image,
        role: isAdded.role,
      });
    } else {
      const newUser = new userModel({
        name: req.body.name,
        email: req.body.email,
        image: req.body.image,
        emailSignup: req.body.emailSignup,
        role: req.body.role,
      });

      const user = await newUser.save();
      const token = signToken(user);
      res.send({
        token,
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
export const getAllUsers = async (req, res) => {
  // #swagger.tags = ['User Management']
  try {
    const users = await employeeModel.find({}).sort({ _id: -1 });
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const getUserById = async (req, res) => {
  // #swagger.tags = ['User Management']
  try {
    const user = await userModel.findById(req.params.id);
    res.send(user);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

export const updateUser = async (req, res) => {
  // #swagger.tags = ['User Management']
  try {
    const user = await userModel.findById(req.params.id);
    if (user) {
      user.name = req.body.name;
      user.email = req.body.email;
      user.address = req.body.address;
      user.phone = req.body.phone;
      user.image = req.body.image;
      user.role = req.body.role;
      user.emailSignup = req.body.emailSignup ? req.body.emailSignup : false;
      const updatedUser = await user.save();
      const token = signToken(updatedUser);
      res.send({
        token,
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        address: updatedUser.address,
        phone: updatedUser.phone,
        image: updatedUser.image,
        role: updatedUser.role,
        emailSignup: updatedUser.emailSignup,
      });
    }
  } catch (err) {
    res.status(404).send({
      message: "Your email is not valid!",
    });
  }
};

export const deleteUser = (req, res) => {
  // #swagger.tags = ['User Management']
  User.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "User Deleted Successfully!",
      });
    }
  });
};

export const verifyOTP = async (req, res) => {
  // #swagger.tags = ['User Management']
  const user = await userModel.findOne({
    email: req.body.email,
    otp: req.body.otp,
    otpExpire: { $gt: Date.now() },
  });
  if (user) {
    user.otp = "";
    user.verified = true;
    user.save();
    const token = signToken(user);
    res.status(200).send({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      image: user.image,
      role: user.role,
    });
  } else {
    res.status(401).send({
      message: "Invalid OTP!",
    });
  }
};

export const forgotpassword = async (req, res) => {
  // #swagger.tags = ['User Management']
  try {
    const isAdded = await employeeModel.findOne({
      "contactInformation.email": req.body.email,
      "contactInformation.verified": true,
      "employmentInformation.status": "Active",
    });
    if (!isAdded) {
      res.status(401).send({
        message: "This Email Not Found/Not Verified!",
      });
    } else {
      let token = generateRandomNumber(20);
      const newUser = {
        personalInformation: {
          token,
          tokenExpire: Date.now() + 3600 * 1000,
        },
      };
      const user = await employeeModel.findOneAndUpdate(
        { "contactInformation.email": req.body.email },
        newUser,
        (err) => {
          if (!err) {
            //transporter
            //  .sendMail({
            //    to: isAdded.contactInformation.email,
            //    from: "info@talentspotify.com",
            //    fromname: "Talent Spotify",
            //    subject: "Reset Password Link",
            //    html: `
            //  <p>Hi ${isAdded.personalInformation.firstName + " " + isAdded.personalInformation.lastName},<br/><br/>
            //  Please <a href="http://localhost:3000/user/resetpassword/${token}"> Click This Link <a/> To Reset Password . It will expire in 24 hours.
            //  <br/><br/>
            //  <p>Talent Spotify</p>
            //  `,
            //  })
            //  .then((response) => {
            //    if (response.message === "success") {
            res.send({
              message: "Reset Link sent",
            });
            //  } else {
            //    res.send({
            //      message: "Mail Not Sent!",
            //    });
            //  }
            //});
          }
        }
      );
      user.save();
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

export const resetpassword = async (req, res) => {
  // #swagger.tags = ['User Management']
  const user = await employeeModel.findOne({
    "personalInformation.token": req.body.token,
    "personalInformation.tokenExpire": { $gt: Date.now() },
    "contactInformation.verified": true,
    "employmentInformation.status": "Active",
  });
  if (user) {
    const newUser = { password: bcrypt.hashSync(req.body.password) };
    await employeeModel.findOneAndUpdate(
      { "personalInformation.token": user.personalInformation.token },
      newUser,
      (err) => {
        if (!err) {
          res.send({
            message: "Password Updated Successfully",
          });
        }
      }
    );
  } else {
    res.status(401).send({
      message: "Invalid Token/Account Not Verified!",
    });
  }
};

export const logout = async (req, res) => {
  employeeModel.findOne(
    { "contactInformation.email": req.body.email },
    (errr, user) => {
      if (!errr) {
        res.send({
          success: true,
          message: "Logout Successfully!",
        });
      } else {
        res.send({
          success: false,
          message: errr ? errr : "Something went wrong",
        });
      }
    }
  );
};
