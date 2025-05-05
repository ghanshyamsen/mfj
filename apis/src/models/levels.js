const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
    order:{
        type: Number,
    },
    name:{
        type: String,
        required: true
    },
    title:{
        type: String
    },
    description:{
        type: String
    },
    price: {
        type: Number,
    },
    paths: {
        type: [mongoose.Types.ObjectId],
        ref: 'LearningPaths',
    },
    status:{
        type:Boolean,
        default:true,
    },
},{ timestamps: true });

levelSchema.index({ paths: 1 });  // Index on status


const Levels = mongoose.model('Levels', levelSchema);

module.exports = Levels;