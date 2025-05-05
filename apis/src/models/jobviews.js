const mongoose = require('mongoose');

const jobviewsSchema = new mongoose.Schema({
    job_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jobs',
        required : true
    },
    employer_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : false
    },
    candidate_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : false
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


jobviewsSchema.index({ job_id: 1 });  // Index on status
jobviewsSchema.index({ employer_id: 1 });  // Index on status
jobviewsSchema.index({ candidate_id: 1 });  // Index on status



const JobViews = mongoose.model('JobViews', jobviewsSchema);

module.exports = JobViews;