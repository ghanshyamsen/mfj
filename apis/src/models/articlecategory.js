const mongoose = require('mongoose');

const articlecategorySchema = new mongoose.Schema({
    title:{
        type: String,
        required : true
    },
    status:{
        type:Boolean,
        default:true,
    }
},{ timestamps: true });

const ArticleCategories = mongoose.model('ArticleCategories', articlecategorySchema);

module.exports = ArticleCategories;