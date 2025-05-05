const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
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
    type_of_action: String
},{ timestamps:true });

AnalyticsSchema.index({ employer_id: 1 });  // Index on status
AnalyticsSchema.index({ job_id: 1 });  // Index on status
AnalyticsSchema.index({ candidate_id: 1 });  // Index on status

const JobAnalytics = mongoose.model('JobAnalytics', AnalyticsSchema);

module.exports = JobAnalytics;