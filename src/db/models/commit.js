const mongoose = require('mongoose');

const Commit = mongoose.model('Commit', {
    hash: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique:true
    },
    author: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    timestamp: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    message: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    project: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },
});

module.exports = {Commit};