const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Products',
        required: true
    },
    credit: {
        type: Number,
        required: false
    },
    txn:{
        type: mongoose.Types.ObjectId,
        ref: 'Transactions',
        required: false
    },
},{timestamps: true});

orderSchema.index({ user: 1 });  // Index on status
orderSchema.index({ product: 1 });  // Index on status
orderSchema.index({ txn: 1 });  // Index on status

const RewardsOrder = mongoose.model('RewardsOrder', orderSchema);

module.exports = RewardsOrder;

