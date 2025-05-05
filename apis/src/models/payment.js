const mongoose = require('mongoose');


const CardSchema = new mongoose.Schema({
    name : String,
    type : String,
    number: Number,
    last_four_digit: Number,
    expiry: String,
    cvv: Number
});


const paymentSchema = new mongoose.Schema({
    payment_method:{
        type: String,
        required : true
    },
    payment_method_user:{
        type: String,
        required : true
    },
    card_info: CardSchema,
    paypal_info:{
        type: String
    },
    default_status:{
        type:Boolean,
        default:false,
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

const PaymentSchema = mongoose.model('Payments', paymentSchema);

module.exports = PaymentSchema;

