const mongoose = require('mongoose');

const PersonalityProfileSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true
    },
    personality_type: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'PersonalityType',  // Reference to the PersonalityType model
        required: true
    }
}, { timestamps: true });  // Corrected from 'timestamp' to 'timestamps'

const PersonalityProfile = mongoose.model('PersonalityProfile', PersonalityProfileSchema);

module.exports = PersonalityProfile;
