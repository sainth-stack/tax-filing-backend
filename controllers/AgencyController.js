import AgencyModel from "../models/AgencyModel";


// Create a new agency
export const createAgency = async (req, res) => {
    try {
        const { name, address, contactNumber, email } = req.body;

        const newAgency = new AgencyModel({
            name,
            address,
            contactNumber,
            email
        });

        await newAgency.save();
        res.send({ message: 'Agency created successfully', agency: newAgency });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all agencies
export const getAgencies = async (req, res) => {
    try {
        const agencies = await AgencyModel.find();
        res.send(agencies);
    } catch (error) {
        res.send({ message: error.message });
    }
};

// Get a single agency by ID
export const getAgencyById = async (req, res) => {
    try {
        const agency = await AgencyModel.findById(req.params.id);
        if (!agency) return res.status(404).json({ message: 'Agency not found' });
        res.status(200).json(agency);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an agency by ID
export const updateAgency = async (req, res) => {
    try {
        const agency = await AgencyModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!agency) return res.send({ message: 'Agency not found' });
        res.send({ message: 'Agency updated successfully', agency });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an agency by ID
export const deleteAgency = async (req, res) => {
    try {
        const agency = await AgencyModel.findByIdAndDelete(req.params.id);
        if (!agency) return res.status(404).json({ message: 'Agency not found' });
        res.send({ message: 'Agency deleted successfully' });
    } catch (error) {
        res.send({ message: error.message });
    }
};
