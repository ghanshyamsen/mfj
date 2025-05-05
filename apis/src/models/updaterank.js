const mongoose = require('mongoose');

const rankSchema = new mongoose.Schema({
    rank:{
        type: mongoose.Schema.Types.ObjectId,
        ref : "Ranks"
    },
    status:{
        type:Boolean,
        default:false,
    },
    total_count:{
        type:Number,
        default:0
    },
    complete_count:{
        type:Number,
        default:0
    }
},{ timestamps: true });

rankSchema.index({ rank: 1 });  // Index on status

const Ranks = mongoose.model('UpdateRanks', rankSchema);

module.exports = Ranks;