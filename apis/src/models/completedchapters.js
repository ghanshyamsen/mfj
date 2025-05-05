const mongoose = require('mongoose');

const completedSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', default: null
    },
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LmsSkills', default: null
    },
    type: {
        type: String,
        enum: ['chapter','assessment'],
        default: 'chapter'
    },
    chapter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SkillMaterials',
        default: null
    },
    assessment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LearningAssessment',
        default: null
    },
    assessment_answer: {
        type: []
    },
    assessment_completed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

completedSchema.index({ user: 1 });  // Index on status
completedSchema.index({ skill: 1 });  // Index on status
completedSchema.index({ type: 1 });  // Index on status
completedSchema.index({ chapter: 1 });  // Index on status
completedSchema.index({ assessment: 1 });  // Index on status

const CompletedChapters = mongoose.model('CompletedChapters', completedSchema);

module.exports = CompletedChapters;
