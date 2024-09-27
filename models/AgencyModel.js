import mongoose from 'mongoose';

const AgencySchema = new mongoose.Schema({

    agencyName: {
        type: String,
        //required: true, // Agency Name is required
        trim: true
    },
    agencyLocation: {
        type: String,
        required: false // Agency Location is not required, adjust as needed
    },
    effectiveStartDate: {
        type: Date,
        //required: true // Effective Start Date is required
    },
    effectiveEndDate: {
        type: Date,
        //required: true // Effective End Date is required
    },
});

// Create the model
const AgencyModel = mongoose.model('Agency', AgencySchema);

export default AgencyModel;
