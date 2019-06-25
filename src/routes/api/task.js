const _ = require('lodash');
const { ObjectId } = require('mongodb');
const taskManager = require('../../managers/taskManager');
const getTask = async function (req, res) {
    const { id } = req.params ;
    if (_.isUndefined(id)) {
        res.status(400).send({
            ok: false,
            message: 'Missing parameters'
        });
    }
    if (!ObjectId.isValid(id)) {
        return res.status(400).send({
            ok: false,
            message: 'ID is not valid'
        });
    }
    try {
        const task = await taskManager.getTask(id);
        if(_.isEmpty(task)){
            res.status(404).send({
                ok:false,
                message: `Task with ID ${id} not found`
            });
        }

        res.status(200).send({
                ok:true,
                message: `Task with ID ${id} founded`,
                task
            });

    } catch (error) {
        res.status(500).send({
            ok:false,
            message: error.message
        });
    }


};

module.exports = {
    getTask
};