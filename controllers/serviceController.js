// controllers/serviceController.js

import serviceModel from "../models/serviceModel.js";

// Create a new service
export const createService = async (req, res) => {
  try {
    const { serviceName, status, effectiveFrom, effectiveTo } = req.body;
    if (!(serviceName, status, effectiveFrom, effectiveTo)) {
      return res.send({
        success: false,
        message: "Please Provide All Fields  ",
      });
    }
    const service = new serviceModel(req.body);
    await service.save();
    return res.send({
      success: true,
      message: "Service Creates Successfully  ",
      service: service,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all services
export const getServices = async (req, res) => {
  try {
    const services = await serviceModel.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single service by ID
export const getServiceById = async (req, res) => {
  try {
    const service = await serviceModel.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a service by ID
export const updateService = async (req, res) => {
  try {
    const service = await serviceModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a service by ID
export const deleteService = async (req, res) => {
  try {
    const service = await serviceModel.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.status(200).json({ message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
