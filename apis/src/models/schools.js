const mongoose = require('mongoose');

const schoolsSchema = new mongoose.Schema({
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

const Schools = mongoose.model('Schools', schoolsSchema);

module.exports = Schools;

