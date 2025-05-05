const mongoose = require('mongoose');

const PersonalityTypeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }
}, { timestamps: true });

const PersonalityType = mongoose.model('PersonalityType', PersonalityTypeSchema);

module.exports = PersonalityType;
