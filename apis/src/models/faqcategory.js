const mongoose = require('mongoose');

const fcatSchema = new mongoose.Schema({
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

const FaqCategorySchema = mongoose.model('Faqcategory', fcatSchema);

module.exports = FaqCategorySchema;

