const mongoose = require('mongoose');


const BiometricSchema = mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    secure: {
        type: Boolean,
        required: true
    }

});

const biometricData = module.exports = mongoose.model('biometricData', BiometricSchema);