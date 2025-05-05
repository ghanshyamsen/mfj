const mongoose = require('mongoose');

const rankSchema = new mongoose.Schema({
    title:{
        type: String,
        required : true
    },
    order:{
        type: String,
    },
    path_count:{
        type: Number,
    },
    skill_count:{
        type: Number,
    },
    image: {
        type: String
    },
    status:{
        type:Boolean,
        default:true,
    },
    default:{
        type:Boolean,
        default:false,
    }
},{ timestamps: true });

const Ranks = mongoose.model('Ranks', rankSchema);

module.exports = Ranks;