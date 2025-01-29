import AgencyModel from "../models/AgencyModel.js";
import User from "../models/employeeModel.js";
import mongoose from "mongoose";

export const createAgency = async (req, res) => {
  const session = await mongoose.startSession(); // Start a session
  session.startTransaction(); // Begin the transaction

  try {
    const {
      agencyName,
      agencyLocation,
      effectiveFrom,
      effectiveTo,
      firstName,
      lastName,
      email,
      password,
    } = req.body?.AgencyDetails;

    // Check if the agency already exists
    const existingAgency = await AgencyModel.findOne({ agencyName }).session(session);
    if (existingAgency) {
      return res.status(400).json({ message: "Agency already exists" });
    }

    // Create the new user first
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      role: "A", // Role for the user
    });
    await newUser.save({ session });

    // Create the new agency and associate the user
    const newAgency = new AgencyModel({
      agencyName,
      agencyLocation,
      effectiveFrom,
      effectiveTo,
      firstName,
      lastName,
      email,
      password,
      userId: newUser._id, // Store the user ID in the agency
    });
    await newAgency.save({ session });

    // Commit the transaction if everything is successful
    await session.commitTransaction();

    return res.status(201).json({
      message: "Agency and user created successfully",
      agency: newAgency,
      user: newUser,
    });
  } catch (error) {
    await session.abortTransaction(); // Rollback all changes if an error occurs
    return res.status(400).json({ error: error.message });
  } finally {
    session.endSession(); // End the session
  }
};


// Get all agencies
export const getAgencies = async (req, res) => {
  try {
    const agencies = await AgencyModel.find();
    res.send(agencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single agency by ID
export const getAgencyById = async (req, res) => {
  try {
    const agency = await AgencyModel.findById(req.params.id);
    if (!agency) return res.status(404).json({ message: "Agency not found" });
    res.status(200).json(agency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an agency by ID
export const updateAgency = async (req, res) => {
  const session = await mongoose.startSession(); // Start a session
  session.startTransaction(); // Begin the transaction

  try {
    const { agencyName, agencyLocation, effectiveFrom, effectiveTo, firstName, lastName,password, email,userId } =
      req.body.AgencyDetails;

    // Find and update the agency
    const agency = await AgencyModel.findByIdAndUpdate(
      req.params.id,
      { agencyName, agencyLocation, effectiveFrom, effectiveTo,firstName,password, lastName, email },
      { new: true, session }
    );

    if (!agency) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Agency not found" });
    }

    // Find and update the user
    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email,agency:agencyName,password },
      { new: true, session }
    );

    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ message: "User not found" });
    }

    // Commit the transaction if everything is successful
    await session.commitTransaction();

    res.json({ message: "Agency and user updated successfully", agency, user });
  } catch (error) {
    await session.abortTransaction(); // Rollback all changes if an error occurs
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession(); // End the session
  }
};


// Delete an agency by ID
export const deleteAgency = async (req, res) => {
  try {
    const agency = await AgencyModel.findByIdAndDelete(req.params.id);
    if (!agency) return res.status(404).json({ message: "Agency not found" });
    res.send({ message: "Agency deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get filter companies
export const getFilterAgencies = async (req, res) => {
  const { agencyName, agencyLocation, effectiveFrom, effectiveTo } = req.body;

  try {
    const filter = {};

    if (agencyName) {
      filter["agencyName"] = { $regex: agencyName, $options: "i" };
    }

    if (agencyLocation) {
      filter["agencyLocation"] = { $regex: agencyLocation, $options: "i" };
    }

    if (effectiveFrom) {
      filter["effectiveFrom"] = { $gte: new Date(effectiveFrom) };
    }

    if (effectiveTo) {
      filter["effectiveTo"] = { $lte: new Date(effectiveTo) };
    }

    const agencies = await AgencyModel.find(filter);
    res.status(200).send(agencies);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
