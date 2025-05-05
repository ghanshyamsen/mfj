const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
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
    user_info:{
        type: Object
    },
    report_reason:{
        type:Array
    },
    report_reason_description:{
        type:String
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

reportSchema.index({ job_id: 1 });  // Index on status
reportSchema.index({ candidate_id: 1 });  // Index on status


const JobReports = mongoose.model('JobReports', reportSchema);

module.exports = JobReports;