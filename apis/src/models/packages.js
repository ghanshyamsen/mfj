const mongoose = require('mongoose');

const PackagesSchema = new mongoose.Schema({
    package_image: {
        type: String,
        required: true
    },
    package_name: {
        type: String,
        required: true
    },
    package_credits: {
        type: Number,
        required: true
    },
    package_price: {
        type: Number,
        required: true
    },
    package_discount: {
        type: Number,
        required: true
    },
    package_status: {
        type: Boolean,
        default: true
    },
    package_popular: {
        type: Boolean,
        default: false
    }
},{timestamps: true});

const Packages = mongoose.model('Packages', PackagesSchema);

module.exports = Packages;