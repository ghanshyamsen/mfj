const mongoose = require('mongoose');

const purchasedSchema = new mongoose.Schema({
    path: {
        type: mongoose.Types.ObjectId,
        ref: 'LearningPaths',
        required: false
    },
    skill: {
        type: mongoose.Types.ObjectId,
        ref: 'LmsSkills',
        required: false
    },
    level: {
        type: mongoose.Types.ObjectId,
        ref: 'Levels',
        required: false
    },
    plan: {
        type: mongoose.Types.ObjectId,
        ref: 'Plans',
        required: false
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    credit: {
        type: Number,
        required: false
    },
    type:{
        type: String,
        enum: [
            'path',
            'skill',
            'internal',
            'level',
            'cover_letter',
            'resume_template',
            'guidance_counselor',
            'life_time_access',
            'lms_access',
            'all_feature_access'
        ],
        default: 'path'
    },
    expiration_period: {
        type: Number,
    },
    txn:{
        type: mongoose.Types.ObjectId,
        ref: 'Transactions',
        required: false
    },
    completed: {
        type: Boolean,
        default: false
    },
    total_chapters_count: {
        type: Number,
    },
    completed_count: {
        type: Number,
    },
    completed_chapters: {
        type: [mongoose.Types.ObjectId],
        ref: 'CompletedChapters',
    },
    rating: {
        type:Number,
        min: 1, // Set minimum slightly above 0
        max: 5
    },
    rewarded: {
        type: Boolean,
        default: false
    }
},{timestamps: true});

purchasedSchema.index({ path: 1 });  // Index on status
purchasedSchema.index({ skill: 1 });  // Index on status
purchasedSchema.index({ user: 1 });  // Index on status
purchasedSchema.index({ type: 1 });  // Index on status
purchasedSchema.index({ txn: 1 });  // Index on status
purchasedSchema.index({ completed_chapters: 1 });  // Index on status

const PurchaseModules = mongoose.model('PurchaseModules', purchasedSchema);

module.exports = PurchaseModules;

