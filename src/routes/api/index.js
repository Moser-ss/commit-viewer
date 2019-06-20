const router = require('express').Router();
const projectController = require('./project');

router.post('/project',projectController.addProject );

module.exports = router;