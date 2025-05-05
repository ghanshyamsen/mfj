const mongoose = require('mongoose');

const jobSugesstionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }
},{timestamps: true});

const JobCategory = mongoose.model('JobCategory', jobSugesstionSchema);

module.exports = JobCategory;