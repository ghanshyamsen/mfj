const mongoose = require('mongoose');

const saveuserSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    candidate_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : false
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

saveuserSchema.index({ user_id: 1 });  // Index on status
saveuserSchema.index({ candidate_id: 1 });  // Index on status


const SavedCandidents = mongoose.model('SavedCandidents', saveuserSchema);

module.exports = SavedCandidents;