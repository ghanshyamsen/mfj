const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    job_position: {
        type: String,
        required: true
    },
    job_by_suggestion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobSuggestions',
        required: false
    },
    job_description: {
        type: String,
        required: false
    },
    job_min_amount: {
        type: Number
    },
    job_max_amount: {
        type: Number
    },
    job_type:{
        type: String,
        required: true
    },
    job_experience_level: {
        type: String,
        required: true
    },
    weekly_day_range:{
        type: [],
        required:true
    },
    weekly_day_range_other: {
        type: String
    },
    shift_time:{
        type: [],
        required: true
    },
    other_shift_time:{
        type: String
    },
    expected_hours: {
        type: [],
        required: true
    },
    expected_min_hour: {
        type: Number
    },
    expected_max_hour: {
        type: Number
    },
    job_pay_type:{
        type: String
    },
    job_pay_type_other:{
        type: String
    },
    job_pay_frequency:{
        type: String
    },
    job_benefits:{
        type:Array
    },
    job_benefits_other:{
        type: String
    },
    pay_is_competitive:{
        type: String
    },
    job_status: {
        type: Boolean,
        required: true,
        default:true
    },
    job_location_type:{
        type: String,
        required: true
    },
    location: {
        type: String
    },
    coordinate:{
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true, index: "2dsphere" }, // [longitude, latitude]
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    location_miles:{
        type: Number
    },
    work_authorization: {
        type: String,
        required: true
    },
    work_authorization_requirement: {
        type: String,
        required: false
    },
    education_level:String,
    year_of_experience:String,
    required_skills:Array,
    other_preferences:String,
    matching_preferences:Object,
    paid_job: {
        type: Boolean,
        required: false,
        default:false
    },
    job_boost: {
        type: Boolean,
        required: false,
        default:false
    },
    credited_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    }
});

jobSchema.index({ coordinate: "2dsphere" }); // Ensure geospatial indexing
jobSchema.index({ user_id: 1 });  // Index on status
jobSchema.index({ job_status: 1 });  // Index on status

const Job = mongoose.model('Jobs', jobSchema);

module.exports = Job;