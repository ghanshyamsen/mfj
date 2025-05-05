const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    path_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LearningPaths',
        required : true
    },
    user_id:{
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
    status:{
        type:Boolean,
        default: true
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


reviewSchema.index({ path_id: 1 });  // Index on path_id for faster aggregation
reviewSchema.index({ user_id: 1 });  // Index on path_id for faster aggregation



const LmsReviews = mongoose.model('LmsReviews', reviewSchema);

module.exports = LmsReviews;