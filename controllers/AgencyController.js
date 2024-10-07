import AgencyModel from "../models/AgencyModel.js";

// Create a new agency
export const createAgency = async (req, res) => {
    try {
        const { agencyName, agencyLocation, effectiveFrom, effectiveTo } = req.body.AgencyDetails;


        const existingAgency = await AgencyModel.findOne({ agencyName });

        console.log("first", existingAgency);
        if (existingAgency) {
            return res.status(400).json({ message: "Agency already exists" });
        }

        const newAgency = new AgencyModel({
            agencyName,
            agencyLocation,
            effectiveFrom,
            effectiveTo,
        });

        await newAgency.save();
        res.send({ message: 'Agency created successfully', agency: newAgency });

    } catch (error) {
        res.status(400).json({ error: error });

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
        if (!agency) return res.status(404).json({ message: 'Agency not found' });
        res.status(200).json(agency);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an agency by ID
export const updateAgency = async (req, res) => {
    try {
        const { agencyName, agencyLocation, effectiveFrom, effectiveTo } = req.body.AgencyDetails;

        const agency = await AgencyModel.findByIdAndUpdate(
            req.params.id,
            { agencyName, agencyLocation, effectiveFrom, effectiveTo },
            { new: true }
        );

        if (!agency) return res.status(404).json({ message: 'Agency not found' });
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

        console.log("filter", filter);

        const agencies = await AgencyModel.find(filter);
        res.status(200).send(agencies);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

