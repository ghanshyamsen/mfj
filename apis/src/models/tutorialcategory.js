const mongoose = require('mongoose');

const tutorialSchema = new mongoose.Schema({
    title:{
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

const TutorialCategorySchema = mongoose.model('TutorialCategory', tutorialSchema);

module.exports = TutorialCategorySchema;

