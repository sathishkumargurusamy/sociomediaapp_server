const mongoose = require('mongoose');


const Storyschema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    userid: {
        type: String,
        required: true
    },
    story: {
        type: String
    },
    time: { type: Date, default: Date.now },
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: '1m' },
    }
});

const story = module.exports = mongoose.model('story', Storyschema);