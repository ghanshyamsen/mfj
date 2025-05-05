const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
    rating:{
        type:Number,
        required: true,
        min: [1, 'Rating must be at least 1.'],
        max: [5, 'Rating cannot exceed 5.'] // Adds custom error messages
    },
    review:{
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

reviewSchema.index({ job_id: 1 });  // Index on status
reviewSchema.index({ employer_id: 1 });  // Index on status
reviewSchema.index({ candidate_id: 1 });  // Index on status

const Reviews = mongoose.model('Reviews', reviewSchema);

module.exports = Reviews;