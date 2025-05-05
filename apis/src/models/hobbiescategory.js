const mongoose = require('mongoose');

const hcatSchema = new mongoose.Schema({
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

const HobbiesCategorySchema = mongoose.model('Hobbiescategory', hcatSchema);

module.exports = HobbiesCategorySchema;

