const mongoose = require('mongoose');

const jobSugesstionSchema = new mongoose.Schema({
    job_category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobCategory',
        required: false
    },
    job_title: {
        type: String,
        required: true
    },
    job_description: {
        type: String,
        required: false
    },
    job_status: {
        type: Boolean,
        default: true
    }
},{timestamps: true});

jobSugesstionSchema.index({ job_category: 1 });  // Index on status

const JobSuggestions = mongoose.model('JobSuggestions', jobSugesstionSchema);

module.exports = JobSuggestions;