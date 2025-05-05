const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    thumbnail: {
        type: String
    },
    skill_logo: {
        type: String,
    },
    skill_badge: {
        type: String,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    credit_price: {
        type: Number,
    },
    reward_price: {
        type: Number,
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
    status: {
        type: Boolean,
        default: true,
    },
    video_link: {
        type: String,
    },
    order:{
        type: Number,
    }
}, { timestamps: true });


skillSchema.index({ upselling_path: 1 });  // Index on skills
skillSchema.index({ upselling_skills: 1 });  // Index on status

const Skills = mongoose.model('LmsSkills', skillSchema);

module.exports = Skills;
