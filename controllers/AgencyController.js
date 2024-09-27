import AgencyModel from "../models/AgencyModel.js";

// Create a new agency
export const createAgency = async (req, res) => {
    try {
        // Accessing the nested AgencyDetails object
        const { agencyName, agencyLocation, effectiveStartDate, effectiveEndDate } = req.body.AgencyDetails;

        console.log("req.body.AgencyDetails", req.body.AgencyDetails);

        // Create a new agency using the extracted values
        const newAgency = new AgencyModel({
            agencyName,
            agencyLocation,
            effectiveStartDate,
            effectiveEndDate
        });

        // Save the new agency to the database
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
        const { agencyName, agencyLocation, effectiveStartDate, effectiveEndDate } = req.body.AgencyDetails;

        const agency = await AgencyModel.findByIdAndUpdate(
            req.params.id,
            { agencyName, agencyLocation, effectiveStartDate, effectiveEndDate },
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
    const { name } = req.body;

    try {
        const filter = {};

        if (name) {
            filter["agencyName"] = { $regex: name, $options: "i" };
        }


        console.log("filter", filter)

        // Fetch companies based on the filter criteria
        const companies = await AgencyModel.find(filter || {});
        res.status(200).send(companies);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
