const mongoose = require('mongoose');

// Define the CareerPath schema as a subdocument
const CareerPathSchema = new mongoose.Schema({
    starter_job: {
        type: String,
        required: true
    },
    mid_level: {
        type: String,
        required: true
    },
    advanced: {
        type: String,
        required: true
    },
    specializations: {
        type: String,
        required: true
    }
});

// Define the main schema for Starter Jobs
const stjobsSchema = new mongoose.Schema({
    career_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Careers',
        required: true
    },
    personality_type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PersonalityType',
        required: true
    },
    job_title: {
        type: String,
        required: true
    },
    personality_traits: {
        type: String,
        required: true
    },
    soft_skills: {
        type: String,
        required: true
    },
    required_skills: {
        type: String,
        required: true
    },
    typical_career_path: {
        type: CareerPathSchema,
        required: true
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

stjobsSchema.index({ career_id: 1 });  // Index on status

stjobsSchema.index({ personality_type: 1 });  // Index on status

// Register the model with Mongoose
const StarterJobsSchema = mongoose.model('StarterJobs', stjobsSchema);

module.exports = StarterJobsSchema;
