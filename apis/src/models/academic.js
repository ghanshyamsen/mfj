const mongoose = require('mongoose');

const academicSchema = new mongoose.Schema({
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

const Academic = mongoose.model('Academic', academicSchema);

module.exports = Academic;