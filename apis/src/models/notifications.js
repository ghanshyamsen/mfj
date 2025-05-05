const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
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
    message: {
        type: String
    },
    link: {
        type: String
    },
    read: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true }); // this will add createdAt and updatedAt fields automatically

notificationSchema.index({ sender: 1 });  // Index on status

notificationSchema.index({ receiver: 1 });  // Index on status

const MNotificationSchema = mongoose.model('Notifications', notificationSchema);

module.exports = MNotificationSchema;
