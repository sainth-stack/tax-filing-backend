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
    const existingAgency = await AgencyModel.findOne({ agencyName }).session(
      session
    );
    if (existingAgency) {
      return res.status(400).json({ message: "Agency already exists" });
    }

    // Create the new agency
    const newAgency = new AgencyModel({
      agencyName,
      agencyLocation,
      effectiveFrom,
      effectiveTo,
      firstName,
      lastName,
      email,
      password,
    });
    await newAgency.save({ session });

    // Check if the user already exists
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      await session.abortTransaction(); // Rollback changes if user exists
      return res
        .status(400)
        .json({ message: "User already exists with this email." });
    }

    // Create the new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      agency: agencyName,
      role: "A",
    });
    await newUser.save({ session });

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
  try {
    const { agencyName, agencyLocation, effectiveFrom, effectiveTo } =
      req.body.AgencyDetails;

    const agency = await AgencyModel.findByIdAndUpdate(
      req.params.id,
      { agencyName, agencyLocation, effectiveFrom, effectiveTo },
      { new: true }
    );

    if (!agency) return res.status(404).json({ message: "Agency not found" });
    res.send({ message: "Agency updated successfully", agency });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
