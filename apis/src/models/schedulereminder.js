const mongoose = require('mongoose');

const scherdulerSchema = new mongoose.Schema({
    from:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    to:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: String
    },
    time: {
        type: Date
    },
    status:{
        type: Boolean,
        default: false
    }
}, { timestamps: true });

scherdulerSchema.index({ from: 1 });  // Index on status
scherdulerSchema.index({ to: 1 });  // Index on status


const ScheduleReminder = mongoose.model('ScheduleReminder', scherdulerSchema);

module.exports = ScheduleReminder;