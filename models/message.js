const mongoose = require('mongoose');


const MessageSchema = mongoose.Schema({
    sendername: {
        type: String,
        required: true
    },
    senderid: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    friendname: {
        type: String,
        required: true
    },
    friendid: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }

});

const message = module.exports = mongoose.model('message', MessageSchema);