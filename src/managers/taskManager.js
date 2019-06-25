const _ = require('lodash');
const { Task } = require('../db/models/task');

const getTask = async function  (id) {
    const task = await Task.findById(id);
    const taskParsed = _.pick(task, 'project', 'status');
    return taskParsed;
};

module.exports = {
    getTask
};