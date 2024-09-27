import mongoose from 'mongoose';

const AgencySchema = new mongoose.Schema({
    name: {
        type: String,
        //required: true,
        trim: true
    },
    address: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        //required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const AgencyModel = mongoose.model('Agency', AgencySchema);

export default AgencyModel;
