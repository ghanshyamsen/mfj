const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductCategories',
        default: null
    },
    title:{
        type: String,
        required : true
    },
    description:{
        type: String,
    },
    price:{
        type: Number,
    },
    image: {
        type: String
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

productSchema.index({ category: 1 });  // Index on status

const Products = mongoose.model('Products', productSchema);

module.exports = Products;