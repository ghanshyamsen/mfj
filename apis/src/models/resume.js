const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    first_name: String,
    last_name: String,
    email: String,
    phone_number: String,
    location: String,
    pronouns: String,
    image: String,
    date_of_birth: String,
    question_one:Object,
    question_one_ans:String,
    question_two:Object,
    question_two_ans:String,
    question_three:Object,
    question_three_ans:String,
    question_four:Object,
    question_four_ans:String,
    question_five:Object,
    question_five_ans:String,
    objective_summary:String,
    skills_assessment:Array,
    education:Array,
    extracurricular_activities:Array,
    volunteer_experience:Array,
    awards_achievments:Array,
    work_experience:Array,
    certification:Array,
    hobbies:Array,
    references:Array,
    personality_assessment:Array,
    personality_assessment_complete_status:{
        type:Boolean,
        default: false
    },
    personality_profile:Array,
    personality_profile_complete_status:{
        type:Boolean,
        default: false
    },
    skills_complete_status:{
        type:Boolean,
        default: false
    },
    education_complete_status:{
        type:Boolean,
        default: false
    },
    activitie_complete_status:{
        type:Boolean,
        default: false
    },
    volunteer_complete_status:{
        type:Boolean,
        default: false
    },
    awards_achievments_status:{
        type:Boolean,
        default: false
    },
    work_experience_status:{
        type:Boolean,
        default: false
    },
    certification_status:{
        type:Boolean,
        default: false
    },
    hobbies_status:{
        type:Boolean,
        default: false
    },
    references_status:{
        type:Boolean,
        default: false
    },
    personal_detail_complete_status:{
        type:Boolean,
        default: false
    },
    job_prefernces_complete_status:{
        type:Boolean,
        default: false
    },
    job_prefernces:{
        type:Object
    },
    objective_complete_status:{
        type:Boolean,
        default: false
    },
    activitie_visible_status:{
        type:Boolean,
        default: true
    },
    volunteer_visible_status:{
        type:Boolean,
        default: true
    },
    awards_achievments_visible_status:{
        type:Boolean,
        default: true
    },
    certification_visible_status:{
        type:Boolean,
        default: true
    },
    hobbies_visible_status:{
        type:Boolean,
        default: true
    },
    resume_theame:{
        type:String,
        enum:['default', 'classic', 'dark'],
        default: 'default'
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


resumeSchema.index({ user_id: 1 });  // Index on status
resumeSchema.index({ resume_theame: 1 });  // Index on status


const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;