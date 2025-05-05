const mongoose = require('mongoose');

const tutorialSchema = new mongoose.Schema({
    question:{
        type: String,
        required : true
    },
    answer:{
        type: String,
        required : true
    },
    category:{
        type: String,
        required : true
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

const TutorialSchema = mongoose.model('Tutorials', tutorialSchema);

module.exports = TutorialSchema;

