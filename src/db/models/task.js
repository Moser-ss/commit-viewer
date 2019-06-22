const mongoose = require('mongoose');

const Task = mongoose.model('Task', {
    project: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },
    status: {
        type: String,
        default: 'PENDING',
        minlength: 3,
        trim: true
    },
});

module.exports = {Task};