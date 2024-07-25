// models/Service.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    effectiveFrom: {
        type: Date,
        required: true
    },
    effectiveTo: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Service', serviceSchema);
