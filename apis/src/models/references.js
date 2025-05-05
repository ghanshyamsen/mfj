const mongoose = require('mongoose');

const ReferenceSchema = new mongoose.Schema({
    reference_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reference_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reference_code: {
        type: String
    },
    reference_status:{
        type: Boolean,
        default: false
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

ReferenceSchema.index({ admin_id: 1 });  // Index on status

const References = mongoose.model('References', ReferenceSchema);

module.exports = References;
