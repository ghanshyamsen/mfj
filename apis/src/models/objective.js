const mongoose = require('mongoose');

const objectiveSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    option_one: {
        type: String,
        required: true
    },
    option_two: {
        type: String,
        required: true
    },
    option_three: {
        type: String,
        required: true
    },
    option_four: {
        type: String,
        required: true
    },
    summary_one: {
        type: String,
        required: true
    },
    summary_two: {
        type: String,
        required: true
    },
    summary_three: {
        type: String,
        required: true
    },
    summary_four: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Objective = mongoose.model('Objective', objectiveSchema);

module.exports = Objective;
