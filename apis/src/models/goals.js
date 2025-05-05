const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    reward_path: {
        type: mongoose.Types.ObjectId,
        ref: 'LearningPaths',
        required: false
    },
    reward_skill: {
        type: mongoose.Types.ObjectId,
        ref: 'LmsSkills',
        required: false
    },
    reward_level: {
        type: mongoose.Types.ObjectId,
        ref: 'Levels',
        required: false
    },
    teenager:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reward_for:{
        type: String,
        enum: ['path', 'skill', 'level'],
        default: 'path'
    },
    reward_type:{
        type: String,
        enum: ['credit', 'product'],
        default: 'credit'
    },
    reward_credit: {
        type: Number,
        required: false
    },
    reward_product: {
        type: mongoose.Types.ObjectId,
        ref: 'Products',
        required: false
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
},{timestamps: true});

goalSchema.index({ reward_path: 1 });  // Index on status
goalSchema.index({ reward_skill: 1 });  // Index on status
goalSchema.index({ reward_level: 1 });  // Index on status
goalSchema.index({ teenager: 1 });  // Index on status
goalSchema.index({ user: 1 });  // Index on status
goalSchema.index({ reward_for: 1 });  // Index on status
goalSchema.index({ reward_product: 1 });  // Index on status
goalSchema.index({ reward_for: 1 });  // Index on status

const Goals = mongoose.model('Goals', goalSchema);

module.exports = Goals;

