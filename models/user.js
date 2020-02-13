const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Userschema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    profileimage: {
        type: String
    },
    dob: {
        type: String
    },
    gender: {
        type: String
    }

});
Userschema.plugin(uniqueValidator);
const user = module.exports = mongoose.model('user', Userschema);