const mongoose = require('mongoose');


const BiometricSchema = mongoose.Schema({
    senderid: {
        type: String,
        required: true
    },
    sendername: {
        type: String,
        required: true
    },
    friendid: {
        type: String,
        required: true
    },
    friendname: {
        type: String,
        required: true
    },
    secure: {
        type: Boolean,
        required: true
    }

});

const biometricData = module.exports = mongoose.model('biometricData', BiometricSchema);