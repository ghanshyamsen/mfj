const mongoose = require('mongoose');

const EmployersAassessmentsSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true
    },
    interpretation_guide: {
        type: [String],
        required: true
    }
}, { timestamps: true });  // Corrected from 'timestamp' to 'timestamps'

const EmployersAassessments = mongoose.model('EmployersAassessments', EmployersAassessmentsSchema);

module.exports = EmployersAassessments;
