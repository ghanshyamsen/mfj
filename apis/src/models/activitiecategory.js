const mongoose = require('mongoose');

const acatSchema = new mongoose.Schema({
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

const ActivitieCategorySchema = mongoose.model('Activitiecategory', acatSchema);

module.exports = ActivitieCategorySchema;

