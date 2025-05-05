const mongoose = require('mongoose');

const JobInvitedSchema = new mongoose.Schema({
    employer_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    job_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jobs',
        required : true
    },
    candidate_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : false
    },
    message: String,
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

JobInvitedSchema.index({ employer_id: 1 });  // Index on status
JobInvitedSchema.index({ job_id: 1 });  // Index on status
JobInvitedSchema.index({ candidate_id: 1 });  // Index on status

const JobInvited = mongoose.model('JobInvited', JobInvitedSchema);

module.exports = JobInvited;

