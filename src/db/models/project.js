const mongoose = require('mongoose');

const Project = mongoose.model('Project', {
    url: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    org: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    repository: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },
});

module.exports = {Project};