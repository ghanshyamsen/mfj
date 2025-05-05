const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  signup_type: {
    type: String,
    default: 'email',
  },
  social_media_id: {
    type: String,
  },
  user_type: {
    type: String,
    required: true,
  },
  employer_type: {
    type: String,
  },
  parents_id: {
    type: String,
  },
  admin_id: {
    type: String,
  },
  role: {
    type: String,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
  },
  preferred_name:String,
  email: {
    type: String,
  },
  phone_number: {
    type: String,
  },
  profile_image: {
    type: String,
  },
  profile_image_visible: {
    type: Boolean,
    default: true,
  },
  date_of_birth: {
    type: String,
  },
  location: {
    type: String,
  },
  location_miles: {
    type: Number,
  },
  street_address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  zip_code: {
    type: String,
  },
  pronouns: {
    type: String,
  },
  pronouns_visible: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
  },
  reset_password_key: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true,
  },
  approval_status: {
    type: Boolean,
    default: false,
  },
  business_type: {
    type: String,
  },
  business_ein_number: {
    type: String,
  },
  business_document: {
    type: Array,
  },
  push_notification: {
    type: Boolean,
    default: true,
  },
  career_tips: {
    type: Boolean,
    default: true,
  },
  platform_update: {
    type: Boolean,
    default: true,
  },
  newsletter: {
    type: Boolean,
    default: true,
  },
  communication_setting_one: {
    type: Boolean,
    default: true,
  },
  communication_setting_two: {
    type: Boolean,
    default: true,
  },
  communication_setting_three: {
    type: Boolean,
    default: true,
  },
  communication_setting_four: {
    type: Boolean,
    default: true,
  },
  social_media_status: {
    type: Boolean,
    default: false,
  },
  linkedin_url: {
    type: String,
  },
  linkedin_visible: {
    type: Boolean,
    default: false,
  },
  instagram_url: {
    type: String,
  },
  instagram_visible: {
    type: Boolean,
    default: false,
  },
  tiktok_url: {
    type: String,
  },
  tiktok_visible: {
    type: Boolean,
    default: false,
  },
  facebook_url: {
    type: String,
  },
  facebook_visible: {
    type: Boolean,
    default: false,
  },
  google_connect: {
    type: Boolean,
    default: false,
  },
  google_connect_data: {
    type: Object
  },
  linkedin_connect: {
    type: Boolean,
    default: false,
  },
  linkedin_connect_data: {
    type: Object
  },
  visibility: {
    type: String,
    enum: ['public', 'private'], // Define the enum here
    default: 'public', // Optional: set a default value
  },
  job_published:{
    type: Boolean,
    default: false
  },
  job_matched:{
    type: Boolean,
    default: false
  },
  company_completed:{
    type: Boolean,
    default: false
  },
  contact_candidate_completed:{
    type: Boolean,
    default: false
  },
  company_logo:{
    type: String,
  },
  company_purpose:{
    type: String,
  },
  company_culture:{
    type: String,
  },
  company_values:{
    type: String,
  },
  company_life:{
    type: String,
  },
  number_of_employees:{
    type: String,
  },
  hear_about:{
    type: String,
  },
  hear_about_other:{
    type: String,
  },
  personality_assessment:Array,
  personality_assessment_complete_status:{
      type:Boolean,
      default: false
  },
  user_deleted: {
    type: Boolean,
    default: false,
  },
  user_deleted_at: {
    type: Date,
  },
  user_last_online_at: {
    type: Date
  },
  user_credit:{
    type: Number,
    default: 0,
  },
  guidance_counselor:{
    type: Boolean,
    default: false,
  },
  purchased_path:{
    type: Array
  },
  purchased_skills:{
    type: Array
  },
  purchased_plan:{
    type: Array
  },
  purchased_templates:{
    type: Array,
    default: 'default'
  },
  purchased_letter:{
    type: Number,
    default: 0
  },
  device_token:{
    type: String
  },
  rank:{
    type: mongoose.Types.ObjectId,
    ref: 'Ranks',
    required:false
  },
  current_level:{
    type: mongoose.Types.ObjectId,
    ref: 'Levels',
    required:false
  },
  reference_code:{
    type: String
  },
  subscription_status:{
    type: Boolean,
    default:false
  },
  subscription_date:{
    type: Date
  },
  subscription_next_payment_date:{
    type: Date
  },
  subscription_id:{
    type: String
  },
  customer_id:{
    type: String
  },
  plan_id:{
    type: mongoose.Types.ObjectId,
    ref: 'Plans',
    required: false
  },
  plan_key:{
    type: String,
  }
}, { timestamps: true }); // Add timestamps option for createdAt and updatedAt

userSchema.index({ rank: 1 });  // Index on status
userSchema.index({ parents_id: 1 });  // Index on status
userSchema.index({ admin_id: 1 });  // Index on status

const User = mongoose.model('User', userSchema);

module.exports = User;
