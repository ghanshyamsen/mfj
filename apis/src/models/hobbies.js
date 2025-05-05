const mongoose = require('mongoose');

const hobbiesSchema = new mongoose.Schema({
    title:{
        type: String,
        required : true
    },
    image:{
        type: String,
        required : false
    },
    category:{
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

const HobbiesSchema = mongoose.model('Hobbies', hobbiesSchema);

module.exports = HobbiesSchema;