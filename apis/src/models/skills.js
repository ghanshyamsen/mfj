const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    title:{
        type: String,
        required : true
    },
    image:{
        type: String
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

const Skills = mongoose.model('Skills', skillSchema);

module.exports = Skills;