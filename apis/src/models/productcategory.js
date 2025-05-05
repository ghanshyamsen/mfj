const mongoose = require('mongoose');

const productcategorySchema = new mongoose.Schema({
    title:{
        type: String,
        required : true
    },
    status:{
        type:Boolean,
        default:true,
    },
    deleted_status:{
        type:Boolean,
        default:false,
    }
},{ timestamps: true });

const ProductCategories = mongoose.model('ProductCategories', productcategorySchema);

module.exports = ProductCategories;