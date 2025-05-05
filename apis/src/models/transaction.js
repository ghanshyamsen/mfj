const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    packages: {
        type: mongoose.Types.ObjectId,
        ref: 'Packages',
        required: false
    },
    plan:{
        type: mongoose.Types.ObjectId,
        ref: 'Plans',
        required: false
    },
    job:{
        type: mongoose.Types.ObjectId,
        ref: 'Jobs',
        required: false
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: false
    },
    credit: {
        type: Number,
        required: true
    },
    type:{
        type: String,
        enum: ['credit', 'debit'],
        default: 'credit'
    },
    session_id: {
        type: String,
        required: false
    },
    payment_intent: {
        type: String,
        required: false
    },
    charge_id: {
        type: String,
        required: false
    },
    invoice_pdf: {
        type: String,
        required: false
    },
},{timestamps: true});

TransactionSchema.index({ packages: 1 });  // Index on status
TransactionSchema.index({ user: 1 });  // Index on status
TransactionSchema.index({ type: 1 });  // Index on status

const Transaction = mongoose.model('Transactions', TransactionSchema);

module.exports = Transaction;