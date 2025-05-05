const mongoose = require('mongoose');

const skillAssessmentSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    option_a: {
        type: String,
        required: true
    },
    option_b: {
        type: String,
        required: true
    },
    option_c: {
        type: String,
        required: true
    },
    option_d: {
        type: String,
        required: true
    },
    points_a: {
        type: Number,
        required: true
    },
    points_b: {
        type: Number,
        required: true
    },
    points_c: {
        type: Number,
        required: true
    },
    points_d: {
        type: Number,
        required: true
    },
    skill_a: {
        type: Array,
        required: true
    },
    skill_b: {
        type: Array,
        required: true
    },
    skill_c: {
        type: Array,
        required: true
    },
    skill_d: {
        type: Array,
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

const SkillsAssessment = mongoose.model('SkillsAssessment', skillAssessmentSchema);

module.exports = SkillsAssessment;