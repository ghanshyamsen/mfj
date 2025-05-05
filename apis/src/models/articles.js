const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ArticleCategories',
        required: true
    },
    title:{
        type: String,
        required : true
    },
    for_user:{
        type: String,
        enum:['teenager','manager','parents'],
        required : true
    },
    image:{
        type: String
    },
    brief_description:{
        type: String
    },
    type:{
        type: String,
        enum:['internal','external'],
        default: 'internal'
    },
    url:{
        type: String
    },
    description:{
        type: String
    },
    status:{
        type:Boolean,
        default:true,
    }
},{ timestamps: true });

articleSchema.index({ category: 1 });  // Index on status
articleSchema.index({ for_user: 1 });  // Index on status

const Articles = mongoose.model('Articles', articleSchema);

module.exports = Articles;