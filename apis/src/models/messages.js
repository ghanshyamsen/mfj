const mongoose = require('mongoose');

const msgSchema = new mongoose.Schema({
    message: {
        type: String
    },
    template: {
        type: String
    },
    media: {
        type: Array // assuming media is an array of strings, adjust if necessary
    },
    media_thumbnail: {
        type: String
    },
    media_duration:{
        type: String
    },
    room: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    read: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true }); // this will add createdAt and updatedAt fields automatically

msgSchema.index({ sender: 1 });  // Index on skills
msgSchema.index({ receiver: 1 });  // Index on status
msgSchema.index({ read: 1 });  // Index on status

const MessageSchema = mongoose.model('Messages', msgSchema);

module.exports = MessageSchema;
