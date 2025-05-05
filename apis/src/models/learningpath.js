const mongoose = require('mongoose');

const LearningSchema = new mongoose.Schema({
    thumbnail:{
        type: String
    },
    logo:{
        type: String,
    },
    badge:{
        type: String,
    },
    title:{
        type: String,
        required : true
    },
    short_description:{
        type: String,
        required : true
    },
    long_description:{
        type: String,
        required : true
    },
    credit_price:{
        type: Number,
    },
    reward_price:{
        type: Number,
    },
    skills:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'LmsSkills',
        required: true
    },
    upselling_path: [
        {
            path: { type: mongoose.Schema.Types.ObjectId, ref: 'LearningPaths', default: null },
            discount: { type: Number, default: 0 }
        }
    ],
    upselling_skills: [
        {
            skill: { type: mongoose.Schema.Types.ObjectId, ref: 'LmsSkills', default: null },
            discount: { type: Number, default: 0 }
        }
    ],
    expiration_period: {
        type: Number,
    },
    status:{
        type:Boolean,
        default:true,
    },
    video_link:{
        type: String,
    },
    order:{
        type: Number,
    }
},{ timestamps: true });

LearningSchema.index({ skills: 1 });  // Index on status
LearningSchema.index({ upselling_path: 1 });  // Index on status
LearningSchema.index({ upselling_skills: 1 });  // Index on status

const LearningPaths = mongoose.model('LearningPaths', LearningSchema);

module.exports = LearningPaths;