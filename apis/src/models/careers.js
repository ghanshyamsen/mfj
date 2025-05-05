const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
    title: {
        type: String
    },
}, { timestamps: true }); // this will add createdAt and updatedAt fields automatically

const CareerSchema = mongoose.model('Careers', careerSchema);

module.exports = CareerSchema;
