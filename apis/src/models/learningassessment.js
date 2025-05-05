const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
    thumbnail: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    brief_description: {
        type: String
    },
    description: {
        type: String
    },
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LmsSkills',
        required: true
    },
    questions: {
        type: []
    },
    status: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

AssessmentSchema.index({ skill: 1 });  // Index on status

const LearningAssessment = mongoose.model('LearningAssessment', AssessmentSchema);

module.exports = LearningAssessment;
