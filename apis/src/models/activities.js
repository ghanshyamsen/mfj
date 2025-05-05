const mongoose = require('mongoose');

const activitieSchema = new mongoose.Schema({
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

const Activitie = mongoose.model('Activitie', activitieSchema);

module.exports = Activitie;