const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    plan_key:{
        type: String,
        required: true
    },
    plan_for: {
        type: String,
        enum: ['student','employer'],
        default: "student"
    },
    plan_name: {
        type: String,
        required: true
    },
    plan_title: {
        type: String,
        required: true
    },
    plan_price: {
        type: Number,
        required: true
    },
    plan_price_text: {
        type: String,
        required: false
    },
    plan_description: {
        type: String,
        required: false
    },
    plan_job: {
        type: Number,
        required: false
    },
    plan_analytics: {
        type: String,
        enum: ['yes','no'],
        default: 'no'
    },
    plan_matches: {
        type: String,
        enum: ['yes','no'],
        default: 'no'
    },
    plan_boosted: {
        type: String,
        enum: ['yes','no'],
        default: 'no'
    },
},{timestamps: true});

const Plans = mongoose.model('Plans', PlanSchema);

module.exports = Plans;