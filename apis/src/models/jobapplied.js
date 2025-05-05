const mongoose = require('mongoose');

const appliedSchema = new mongoose.Schema({
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
    job_info:{
        type:Object
    },
    user_info:{
        type:Object
    },
    status:{
        type: String,
        enum: ["Pending","Refused","Invited"],
        default: "Pending"
    },
    cover_letter:String,
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

appliedSchema.index({ employer_id: 1 });  // Index on status
appliedSchema.index({ job_id: 1 });  // Index on status
appliedSchema.index({ candidate_id: 1 });  // Index on status

const AppliedCandidents = mongoose.model('JobAppliedCandidents', appliedSchema);

module.exports = AppliedCandidents;