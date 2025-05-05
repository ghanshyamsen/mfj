const mongoose = require('mongoose');

const EmployeesAassessmentsSchema = new mongoose.Schema({
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

const EmployeesAassessments = mongoose.model('EmployeesAassessments', EmployeesAassessmentsSchema);

module.exports = EmployeesAassessments;
