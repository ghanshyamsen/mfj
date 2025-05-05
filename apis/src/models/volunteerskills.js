const mongoose = require('mongoose');

const volunteerSkillSchema = new mongoose.Schema({
    title:{
        type: String,
        required : true
    },
    image:{
        type: String,
        required : false
    },
    status:{
        type:Boolean,
        default:true,
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

const VolunteerSkills = mongoose.model('VolunteerSkills', volunteerSkillSchema);

module.exports = VolunteerSkills;