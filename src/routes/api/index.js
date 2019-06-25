const router = require('express').Router();
const projectController = require('./project');
const commitController = require('./commit');
const taskController = require('./task');

router.post('/project',projectController.addProject );
router.get('/project/:org/:repo/commits', commitController.getCommits );
router.get('/task/:id/', taskController.getTask );

module.exports = router;