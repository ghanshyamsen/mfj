const mongoose = require('mongoose');

const RoomsSchema = new mongoose.Schema({
    users:{
        type: Array,
        required : true
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    room_status:{
        type:String,
        enum:['open', 'closed'],
        default: 'open'

    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

RoomsSchema.index({ users: 1 });  // Index on status


const ChatRoomsSchema = mongoose.model('ChatRooms', RoomsSchema);

module.exports = ChatRoomsSchema;

